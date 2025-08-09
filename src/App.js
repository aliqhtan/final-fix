<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>المعلق الصوتي الذكي</title>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        body {
            font-family: 'Cairo', sans-serif;
            margin: 0;
            background-color: #111827;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 1rem;
        }
        .container {
            width: 100%;
            max-width: 42rem;
            background-color: #1f2937;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 1.5rem;
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
        .header-icon {
            padding: 0.75rem;
            background-color: #4f46e5;
            border-radius: 9999px;
        }
        .header-title {
            font-size: 1.875rem;
            font-weight: bold;
            margin-right: 1rem;
        }
        .description {
            color: #9ca3af;
            margin-bottom: 1.5rem;
        }
        .textarea-container {
            background-color: #111827;
            padding: 1rem;
            border-radius: 0.5rem;
        }
        .textarea {
            width: 100%;
            height: 10rem;
            background-color: transparent;
            color: white;
            font-size: 1.125rem;
            padding: 0.5rem;
            border-radius: 0.375rem;
            border: none;
            outline: none;
            font-family: inherit;
            resize: vertical;
        }
        .controls-grid {
            margin-top: 1.5rem;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
        .select-container {
            position: relative;
            grid-column: span 1;
        }
        .select {
            width: 100%;
            appearance: none;
            background-color: #374151;
            color: white;
            font-weight: bold;
            padding: 1rem 2.5rem 1rem 1rem;
            border-radius: 0.5rem;
            border: none;
            outline: none;
            font-family: inherit;
            height: 100%;
        }
        .select-icon {
            pointer-events: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            padding: 0 0.75rem;
            color: #9ca3af;
        }
        .button {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
            padding: 1rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s;
            cursor: pointer;
            grid-column: span 2;
            border: none;
        }
        .button:disabled {
            background-color: #312e81;
            cursor: not-allowed;
        }
        .button-content {
            display: flex;
            align-items: center;
        }
        .button-text {
            margin-right: 0.5rem;
        }
        .error-message {
            color: #f87171;
            margin-top: 1rem;
            text-align: center;
        }
        .audio-player-container {
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: #374151;
            border-radius: 0.5rem;
        }
        .api-key-container {
            margin-bottom: 1.5rem;
            background-color: #111827;
            padding: 1rem;
            border-radius: 0.5rem;
        }
        .api-key-input {
            width: 100%;
            background-color: #374151;
            border: 1px solid #4b5563;
            color: white;
            padding: 0.75rem;
            border-radius: 0.375rem;
            font-family: inherit;
        }
        .api-key-button {
            width: 100%;
            margin-top: 0.75rem;
            background-color: #10b981;
            color: white;
            font-weight: bold;
            padding: 0.75rem;
            border-radius: 0.375rem;
            border: none;
            cursor: pointer;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
    </style>
</head>
<body>

    <div id="root"></div>

    <script type="text/babel">
        // --- أيقونات SVG مدمجة ---
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
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        // --- قائمة الأصوات المتاحة ---
        const availableVoices = [
            { id: 'Iapetus', name: 'صوت قرآني (واضح ومهيب)' },
            { id: 'Gacrux', name: 'الراوي الوثائقي (ناضج)' },
            { id: 'Algenib', name: 'صوت عميق (رخيم)' },
            { id: 'Schedar', name: 'الراوي الهادئ (متزن)' },
            { id: 'Orus', name: 'صوت حازم (قوي)' },
        ];

        // --- المكون الرئيسي للتطبيق ---
        function App() {
            const [text, setText] = React.useState('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ');
            const [isLoading, setIsLoading] = React.useState(false);
            const [audioUrl, setAudioUrl] = React.useState('');
            const [error, setError] = React.useState('');
            const [selectedVoice, setSelectedVoice] = React.useState(availableVoices[0].id);
            const [apiKey, setApiKey] = React.useState('');
            const [tempApiKey, setTempApiKey] = React.useState('');

            React.useEffect(() => {
                const savedApiKey = localStorage.getItem('geminiApiKey');
                if (savedApiKey) {
                    setApiKey(savedApiKey);
                    setTempApiKey(savedApiKey);
                }
            }, []);

            const handleSaveApiKey = () => {
                localStorage.setItem('geminiApiKey', tempApiKey);
                setApiKey(tempApiKey);
                alert('تم حفظ المفتاح بنجاح!');
            };

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
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true);
                view.setUint16(22, channels, true);
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, byteRate, true);
                view.setUint16(32, channels * (bitsPerSample / 8), true);
                view.setUint16(34, bitsPerSample, true);
                view.setUint32(36, 0x64617461, false); // "data"
                view.setUint32(40, pcmLength, true);
                const wavBlob = new Blob([header, pcmData], { type: 'audio/wav' });
                return URL.createObjectURL(wavBlob);
            };

            const base64ToArrayBuffer = (base64) => {
                const binaryString = window.atob(base64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
            };

            const handleGenerateSpeech = async () => {
                if (!apiKey) {
                    setError('خطأ: يرجى إدخال مفتاح API أولاً.');
                    return;
                }
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

                const payload = {
                    contents: [{ parts: [{ text: instructionPrompt }] }],
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } } }
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
                    setError('حدث خطأ أثناء إنشاء الصوت. تأكد من صحة مفتاح API.');
                } finally {
                    setIsLoading(false);
                }
            };

            return (
                <div className="container">
                    <div className="header">
                        <div className="header-icon"><MicIcon /></div>
                        <h1 className="header-title">المعلق الصوتي الذكي</h1>
                    </div>
                    <p className="description">
                        اكتب أي نص، اختر صوت المعلق، واستمع إلى تعليق صوتي احترافي.
                    </p>
                    
                    <div className="api-key-container">
                        <input
                            type="password"
                            value={tempApiKey}
                            onChange={(e) => setTempApiKey(e.target.value)}
                            className="api-key-input"
                            placeholder="أدخل مفتاح API الخاص بك هنا"
                        />
                        <button onClick={handleSaveApiKey} className="api-key-button">حفظ المفتاح</button>
                    </div>

                    <div className="textarea-container">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="textarea"
                            placeholder="اكتب النص هنا..."
                        />
                    </div>
                    <div className="controls-grid">
                        <div className="select-container">
                            <select
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="select"
                            >
                                {availableVoices.map(voice => (
                                    <option key={voice.id} value={voice.id}>
                                        {voice.name}
                                    </option>
                                ))}
                            </select>
                            <div className="select-icon"><ChevronDownIcon /></div>
                        </div>
                        <button
                            onClick={handleGenerateSpeech}
                            disabled={isLoading}
                            className="button"
                        >
                            <span className="button-content">
                                {isLoading ? <LoaderIcon /> : <VolumeIcon />}
                                <span className="button-text">{isLoading ? 'جاري الإنشاء...' : 'استمع الآن'}</span>
                            </span>
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {audioUrl && (
                        <div className="audio-player-container">
                            <audio controls autoPlay src={audioUrl} className="audio-player">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>
            );
        }

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>

</body>
</html>
