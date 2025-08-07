import React, { useState } from 'react';

// --- أيقونات SVG مدمجة لإزالة الاعتماد على مكتبات خارجية ---
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
  </svg>
);

const VolumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);


// --- قائمة الأصوات المتاحة مع أسماء وصفية ---
const availableVoices = [
  { id: 'Iapetus', name: 'صوت قرآني (واضح ومهيب)' },
  { id: 'Gacrux', name: 'الراوي الوثائقي (ناضج)' },
  { id: 'Algenib', name: 'صوت عميق (رخيم)' },
  { id: 'Schedar', name: 'الراوي الهادئ (متزن)' },
  { id: 'Orus', name: 'صوت حازم (قوي)' },
];

// --- المكون الرئيسي للتطبيق ---
export default function App() {
  const [text, setText] = useState('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(availableVoices[0].id); // Default to the Quranic voice

  // --- دالة لتحويل بيانات الصوت الخام إلى ملف WAV قابل للتشغيل ---
  const pcmToWav = (pcmData, sampleRate) => {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    const pcmLength = pcmData.byteLength;
    const totalLength = pcmLength + 36;
    const channels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * channels * (bitsPerSample / 8);

    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, totalLength, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Sub-chunk size
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, channels * (bitsPerSample / 8), true); // Block align
    view.setUint16(34, bitsPerSample, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, pcmLength, true);
    const wavBlob = new Blob([header, pcmData], { type: 'audio/wav' });
    return URL.createObjectURL(wavBlob);
  };
  
  // --- دالة لفك تشفير Base64 ---
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };


  // --- دالة استدعاء Gemini API لإنشاء الصوت ---
  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError('يرجى كتابة نص أولاً.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAudioUrl('');

    let instructionPrompt;

    if (selectedVoice === 'Iapetus') {
        instructionPrompt = `تحدث بهذا النص بصوت فخم وواضح، وبنبرة هادئة ومهيبة. استخدم وقفات طبيعية للتنفس والتأكيد لجعل الكلام واقعياً ومؤثراً، لكن بدون تجويد أو ترتيل. اقرأ فقط النص التالي: ${text}`;
    } else {
        instructionPrompt = `تصرف كمعلق صوتي محترف وموهوب. مهمتك هي أن تبث الحياة في النص التالي. لا تقرأه فحسب، بل اروِه. استخدم نبرة صوت طبيعية ودافئة، مع وقفات محسوبة للتنفس والتأكيد. غيّر في سرعة كلامك ونبرتك بمهارة لتجسيد المشاعر في النص. تحدث بلغة عربية فصيحة وواضحة. النص هو: ${text}`;
    }
    
    const apiKey = (typeof process !== 'undefined' && process.env.REACT_APP_GEMINI_API_KEY) || "";
    if (!apiKey) {
        setError('خطأ: مفتاح API غير موجود. يرجى إضافته في إعدادات Vercel.');
        setIsLoading(false);
        return;
    }

    const payload = {
        contents: [{
            parts: [{ text: instructionPrompt }]
        }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: selectedVoice }
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;

        if (audioData && mimeType && mimeType.startsWith("audio/")) {
            const sampleRateMatch = mimeType.match(/rate=(\d+)/);
            const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 24000;
            const pcmData = base64ToArrayBuffer(audioData);
            const wavUrl = pcmToWav(pcmData, sampleRate);
            setAudioUrl(wavUrl);
        } else {
            throw new Error("لم يتم العثور على بيانات صوتية في الاستجابة.");
        }

    } catch (e) {
      console.error("Error generating speech:", e);
      setError('حدث خطأ أثناء إنشاء الصوت. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827', color: 'white', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '42rem', backgroundColor: '#1f2937', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#4f46e5', borderRadius: '9999px' }}>
            <MicIcon />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginRight: '1rem' }}>المعلق الصوتي الذكي</h1>
        </div>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          اكتب أي نص، اختر صوت المعلق، واستمع إلى تعليق صوتي احترافي.
        </p>

        <div style={{ backgroundColor: '#111827', padding: '1rem', borderRadius: '0.5rem' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', height: '10rem', backgroundColor: 'transparent', color: 'white', fontSize: '1.125rem', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', outline: 'none' }}
            placeholder="اكتب النص هنا..."
          />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem' }}>
          <div style={{ position: 'relative', gridColumn: 'span 1 / span 1' }}>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              style={{ width: '100%', appearance: 'none', backgroundColor: '#374151', color: 'white', fontWeight: 'bold', padding: '1rem 2.5rem 1rem 1rem', borderRadius: '0.5rem', border: 'none', outline: 'none' }}
            >
              {availableVoices.map(voice => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
            <div style={{ pointerEvents: 'none', position: 'absolute', top: '0', bottom: '0', left: '0', display: 'flex', alignItems: 'center', padding: '0 0.75rem', color: '#9ca3af' }}>
                <ChevronDownIcon />
            </div>
          </div>
          <button
            onClick={handleGenerateSpeech}
            disabled={isLoading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isLoading ? '#312e81' : '#4f46e5', color: 'white', fontWeight: 'bold', padding: '1rem', borderRadius: '0.5rem', transition: 'background-color 0.3s', cursor: isLoading ? 'not-allowed' : 'pointer', gridColumn: 'span 1 / span 2', border: 'none' }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <LoaderIcon />
                <span style={{ marginRight: '0.5rem' }}>جاري إنشاء الصوت...</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <VolumeIcon />
                <span style={{ marginRight: '0.5rem' }}>استمع الآن</span>
              </span>
            )}
          </button>
        </div>

        {error && <p style={{ color: '#f87171', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}

        {audioUrl && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#374151', borderRadius: '0.5rem' }}>
            <audio controls autoPlay src={audioUrl} style={{ width: '100%' }}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        .font-cairo {
          font-family: 'Cairo', sans-serif;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
