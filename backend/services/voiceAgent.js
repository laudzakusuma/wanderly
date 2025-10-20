const OpenAI = require('openai');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');

class VoiceAgent {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.conversationHistory = new Map();
    
    // Booking state machine
    this.bookingStates = {
      IDLE: 'idle',
      COLLECTING_INFO: 'collecting_info',
      CONFIRMING: 'confirming',
      PROCESSING: 'processing',
      COMPLETED: 'completed'
    };
  }

  // Initialize conversation context with booking state
  initializeConversation(sessionId) {
    this.conversationHistory.set(sessionId, {
      messages: [],
      lastActivity: Date.now(),
      userPreferences: {},
      bookingState: this.bookingStates.IDLE,
      bookingData: {
        destination: null,
        customer: {},
        tripDetails: {},
        confirmed: false
      }
    });
  }

  getContext(sessionId) {
    return this.conversationHistory.get(sessionId) || this.initializeConversation(sessionId);
  }

  updateContext(sessionId, message, role = 'user') {
    const context = this.getContext(sessionId);
    context.messages.push({ role, content: message, timestamp: Date.now() });
    context.lastActivity = Date.now();
  }

  // Enhanced system prompt with booking capabilities
  getSystemPrompt() {
    return `Kamu adalah Wanderly AI, asisten booking travel yang cerdas dan ramah. Kamu bisa:

1. **Mencari & Merekomendasikan Destinasi**
   - Filter berdasarkan budget, kategori, lokasi
   - Berikan 2-3 rekomendasi terbaik dengan detail

2. **Melakukan Booking Otomatis** ⭐
   - Kumpulkan info booking: nama, email, phone, tanggal, jumlah tamu
   - Konfirmasi detail sebelum proses
   - Buat booking dan berikan kode booking

3. **Membantu Pengelolaan Booking**
   - Cek status booking
   - Cancel booking jika diperlukan

**Alur Booking:**
1. User tertarik destinasi → Tanyakan apakah mau booking
2. Kumpulkan data:
   - Nama lengkap
   - Email & nomor telepon/WhatsApp
   - Tanggal check-in & check-out
   - Jumlah tamu (dewasa & anak)
3. Konfirmasi semua detail + total harga
4. Jika user setuju → Proses booking → Berikan kode booking

**Gaya Komunikasi:**
- Natural & conversational (Bahasa Indonesia)
- Antusias tapi profesional
- Konfirmasi setiap data penting
- Jelas tentang harga & terms

**Contoh Pertanyaan:**
- "Boleh minta nama lengkap kamu?"
- "Email dan nomor WhatsApp yang bisa dihubungi?"
- "Kapan kamu berencana check-in?"
- "Berapa orang yang ikut? (dewasa dan anak-anak)"

Selalu gunakan function calling untuk:
- search_destinations
- create_booking
- check_booking
- cancel_booking`;
  }

  // Define available functions for AI
  getFunctions() {
    return [
      {
        name: "search_destinations",
        description: "Search for travel destinations based on criteria",
        parameters: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["Pantai", "Gunung", "Kota", "Sejarah", "Kuliner", "Petualangan", "Religi", "Lainnya"],
              description: "Category of destination"
            },
            country: {
              type: "string",
              description: "Country name"
            },
            maxPrice: {
              type: "number",
              description: "Maximum budget in IDR"
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "Keywords to search (e.g., romantic, family, adventure)"
            }
          }
        }
      },
      {
        name: "create_booking",
        description: "Create a new booking for a destination",
        parameters: {
          type: "object",
          properties: {
            destinationId: {
              type: "string",
              description: "MongoDB ObjectId of the destination"
            },
            customerName: {
              type: "string",
              description: "Full name of the customer"
            },
            customerEmail: {
              type: "string",
              description: "Email address"
            },
            customerPhone: {
              type: "string",
              description: "Phone number"
            },
            checkInDate: {
              type: "string",
              description: "Check-in date (YYYY-MM-DD)"
            },
            checkOutDate: {
              type: "string",
              description: "Check-out date (YYYY-MM-DD)"
            },
            adults: {
              type: "number",
              description: "Number of adult guests"
            },
            children: {
              type: "number",
              description: "Number of children"
            }
          },
          required: ["destinationId", "customerName", "customerEmail", "customerPhone", "checkInDate", "checkOutDate", "adults"]
        }
      },
      {
        name: "check_booking",
        description: "Check booking status by booking code",
        parameters: {
          type: "object",
          properties: {
            bookingCode: {
              type: "string",
              description: "Booking code (e.g., WDL-20250111-12345)"
            }
          },
          required: ["bookingCode"]
        }
      },
      {
        name: "cancel_booking",
        description: "Cancel an existing booking",
        parameters: {
          type: "object",
          properties: {
            bookingCode: {
              type: "string",
              description: "Booking code to cancel"
            },
            reason: {
              type: "string",
              description: "Reason for cancellation"
            }
          },
          required: ["bookingCode"]
        }
      }
    ];
  }

  // Execute function calls
  async executeFunction(functionName, functionArgs) {
    switch (functionName) {
      case 'search_destinations':
        return await this.queryDestinations(functionArgs);
      
      case 'create_booking':
        return await this.createBooking(functionArgs);
      
      case 'check_booking':
        return await this.checkBooking(functionArgs.bookingCode);
      
      case 'cancel_booking':
        return await this.cancelBooking(functionArgs.bookingCode, functionArgs.reason);
      
      default:
        return { error: 'Unknown function' };
    }
  }

  // Search destinations (existing)
  async queryDestinations(parameters) {
    try {
      let query = { isActive: true };

      if (parameters.category) {
        query.category = parameters.category;
      }

      if (parameters.country) {
        query.country = new RegExp(parameters.country, 'i');
      }

      if (parameters.maxPrice) {
        query['price.max'] = { $lte: parameters.maxPrice };
      }

      if (parameters.keywords && parameters.keywords.length > 0) {
        query.$or = parameters.keywords.flatMap(keyword => [
          { name: new RegExp(keyword, 'i') },
          { description: new RegExp(keyword, 'i') },
          { tags: new RegExp(keyword, 'i') }
        ]);
      }

      const destinations = await Destination.find(query)
        .sort({ averageRating: -1 })
        .limit(3);

      return {
        success: true,
        count: destinations.length,
        destinations: destinations.map(d => ({
          id: d._id,
          name: d.name,
          location: `${d.city}, ${d.country}`,
          category: d.category,
          description: d.description.substring(0, 150) + '...',
          priceRange: `Rp${d.price.min.toLocaleString()} - Rp${d.price.max.toLocaleString()}`,
          rating: d.averageRating
        }))
      };

    } catch (error) {
      console.error('Error querying destinations:', error);
      return { success: false, error: error.message };
    }
  }

  // Create booking
  async createBooking(bookingData) {
    try {
      // Validate destination
      const destination = await Destination.findById(bookingData.destinationId);
      if (!destination) {
        return { success: false, error: 'Destinasi tidak ditemukan' };
      }

      // Calculate duration and pricing
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      
      const adults = bookingData.adults || 1;
      const children = bookingData.children || 0;
      const totalGuests = adults + children;
      
      const basePrice = destination.price.min * totalGuests;
      const tax = (basePrice * duration) * 0.11;
      const totalPrice = (basePrice * duration) + tax;

      // Create booking
      const booking = await Booking.create({
        destination: bookingData.destinationId,
        customer: {
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          phone: bookingData.customerPhone,
          whatsapp: bookingData.customerPhone
        },
        tripDetails: {
          checkInDate: checkIn,
          checkOutDate: checkOut,
          numberOfGuests: {
            adults,
            children
          },
          duration
        },
        package: {
          name: 'Standard Package',
          description: `Paket wisata ${duration} hari ${duration - 1} malam ke ${destination.name}`,
          inclusions: [
            'Akomodasi',
            'Tour guide',
            'Transportasi lokal',
            'Tiket masuk objek wisata'
          ]
        },
        pricing: {
          basePrice,
          taxAndFees: tax,
          discount: 0,
          totalPrice,
          currency: 'IDR'
        },
        aiMetadata: {
          createdViaVoice: true
        }
      });

      await booking.populate('destination');

      return {
        success: true,
        bookingCode: booking.bookingCode,
        destination: destination.name,
        customer: bookingData.customerName,
        checkIn: checkIn.toLocaleDateString('id-ID'),
        checkOut: checkOut.toLocaleDateString('id-ID'),
        guests: `${adults} dewasa${children > 0 ? `, ${children} anak` : ''}`,
        duration: `${duration} hari ${duration - 1} malam`,
        totalPrice: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(totalPrice),
        status: booking.status,
        paymentInstructions: 'Silakan transfer ke rekening BCA 1234567890 a.n. Wanderly Travel'
      };

    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Check booking status
  async checkBooking(bookingCode) {
    try {
      const booking = await Booking.findOne({ bookingCode })
        .populate('destination');

      if (!booking) {
        return { success: false, error: 'Booking tidak ditemukan' };
      }

      return {
        success: true,
        bookingCode: booking.bookingCode,
        destination: booking.destination.name,
        customer: booking.customer.name,
        checkIn: booking.tripDetails.checkInDate.toLocaleDateString('id-ID'),
        checkOut: booking.tripDetails.checkOutDate.toLocaleDateString('id-ID'),
        status: booking.status,
        paymentStatus: booking.payment.status,
        totalPrice: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(booking.pricing.totalPrice)
      };

    } catch (error) {
      console.error('Error checking booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel booking
  async cancelBooking(bookingCode, reason) {
    try {
      const booking = await Booking.findOne({ bookingCode });

      if (!booking) {
        return { success: false, error: 'Booking tidak ditemukan' };
      }

      if (booking.status === 'cancelled') {
        return { success: false, error: 'Booking sudah dibatalkan sebelumnya' };
      }

      // Calculate refund
      const daysUntilCheckIn = Math.ceil(
        (booking.tripDetails.checkInDate - Date.now()) / (1000 * 60 * 60 * 24)
      );

      let refundPercentage = 0;
      if (daysUntilCheckIn > 7) refundPercentage = 100;
      else if (daysUntilCheckIn >= 3) refundPercentage = 50;

      const refundAmount = (booking.pricing.totalPrice * refundPercentage) / 100;

      booking.status = 'cancelled';
      booking.cancellation = {
        cancelledAt: Date.now(),
        cancelledBy: 'customer',
        reason: reason || 'Cancelled by customer via AI',
        refundAmount
      };

      await booking.save();

      return {
        success: true,
        bookingCode: booking.bookingCode,
        status: 'cancelled',
        refundAmount: new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(refundAmount),
        refundPercentage: `${refundPercentage}%`
      };

    } catch (error) {
      console.error('Error cancelling booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Enhanced process with function calling
  async processVoiceQuery(sessionId, userMessage) {
    try {
      this.updateContext(sessionId, userMessage, 'user');
      const context = this.getContext(sessionId);

      // Build messages for GPT with function calling
      const messages = [
        { role: "system", content: this.getSystemPrompt() },
        ...context.messages.slice(-10).map(m => ({ 
          role: m.role, 
          content: m.content 
        }))
      ];

      // Call GPT with function calling
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages,
        functions: this.getFunctions(),
        function_call: "auto",
        temperature: 0.8,
        max_tokens: 300
      });

      const responseMessage = completion.choices[0].message;

      // Handle function calls
      if (responseMessage.function_call) {
        const functionName = responseMessage.function_call.name;
        const functionArgs = JSON.parse(responseMessage.function_call.arguments);

        console.log(`🔧 Executing function: ${functionName}`, functionArgs);

        const functionResult = await this.executeFunction(functionName, functionArgs);

        // Get AI response based on function result
        const followUpMessages = [
          ...messages,
          responseMessage,
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(functionResult)
          }
        ];

        const followUpCompletion = await this.openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: followUpMessages,
          temperature: 0.8,
          max_tokens: 300
        });

        const finalResponse = followUpCompletion.choices[0].message.content;
        this.updateContext(sessionId, finalResponse, 'assistant');

        return {
          success: true,
          response: finalResponse,
          functionCalled: functionName,
          functionResult,
          data: functionResult
        };
      }

      // Regular response without function call
      const response = responseMessage.content;
      this.updateContext(sessionId, response, 'assistant');

      return {
        success: true,
        response
      };

    } catch (error) {
      console.error('Error processing voice query:', error);
      return {
        success: false,
        response: 'Maaf, ada kesalahan saat memproses permintaan. Bisa coba lagi?',
        error: error.message
      };
    }
  }

  // Clean up old conversations
  cleanupOldConversations() {
    const now = Date.now();
    const timeout = 30 * 60 * 1000;
    
    for (const [sessionId, context] of this.conversationHistory.entries()) {
      if (now - context.lastActivity > timeout) {
        this.conversationHistory.delete(sessionId);
      }
    }
  }

  // Audio methods (keep existing)
  async generateAudio(text, voice = 'nova') {
    try {
      const mp3 = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: text,
        speed: 1.0
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return buffer;

    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }

  async transcribeAudio(audioBuffer, format = 'webm') {
    try {
      const file = new File([audioBuffer], `audio.${format}`, { 
        type: `audio/${format}` 
      });

      const transcription = await this.openai.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        language: "id"
      });

      return transcription.text;

    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
}

// Singleton instance
const voiceAgent = new VoiceAgent();

// Cleanup interval
setInterval(() => {
  voiceAgent.cleanupOldConversations();
}, 10 * 60 * 1000);

module.exports = voiceAgent;