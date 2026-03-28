import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Download, Share2, Sparkles, RefreshCw, FileText, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Edit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { original, vibe } = location.state || { original: "No text provided", vibe: "formal" };

  const [transformedText, setTransformedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);

  // --- MOCK AI LOGIC ---
  // This simulates the transformation for your project assessment
  const getTransformedContent = (text: string, style: string) => {
    const prefixes: Record<string, string> = {
      formal: "Respected Recipient,\n\nI am writing to formally communicate the following: ",
      friendly: "Hey there! Hope you're doing awesome. Just wanted to reach out and say: ",
      business: "Dear Team,\n\nPlease find the updated brief regarding our discussion: ",
      urgent: "URGENT NOTICE: Immediate attention is required for the following matter: "
    };
    return (prefixes[style] || "") + text + "\n\nBest regards,\nSoniya";
  };

  useEffect(() => {
    const fullText = getTransformedContent(original, vibe);
    let index = 0;
    
    // Typing effect logic
    const interval = setInterval(() => {
      setTransformedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15); // Speed of typing

    return () => clearInterval(interval);
  }, [original, vibe]);

  const handleCopy = () => {
    navigator.clipboard.writeText(transformedText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-white/40 hover:text-purple-400 transition-colors font-black text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Editor
          </button>
          <div className="px-4 py-2 bg-purple-600/20 border border-purple-500/40 rounded-full flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Vibe: {vibe}</span>
          </div>
        </div>

        {/* MAIN DISPLAY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black italic uppercase text-white/90">Transformed Reply</h2>
            <div className="flex gap-2">
                <Button onClick={handleCopy} variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-purple-600/20 text-purple-400">
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </Button>
            </div>
          </div>

          <div className="min-h-[300px] text-lg leading-relaxed text-white/80 whitespace-pre-wrap font-medium">
            {transformedText}
            {isTyping && <span className="inline-block w-2 h-6 bg-purple-500 ml-1 animate-pulse" />}
          </div>

          <div className="mt-10 flex flex-wrap gap-4 pt-8 border-t border-white/5">
            <Button onClick={() => toast.success("Downloading...")} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl px-8 h-14 font-black text-[11px] uppercase tracking-widest">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-500 text-white rounded-2xl px-8 h-14 font-black text-[11px] uppercase tracking-widest ml-auto">
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </Button>
          </div>
        </motion.div>

        {/* MOBILE PREVIEW SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white/5 rounded-[30px] border border-white/5 flex items-center gap-5">
                <div className="h-12 w-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                    <Smartphone className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-white/40 mb-1">Mobile Ready</p>
                    <p className="text-sm font-bold">Optimized for small screens</p>
                </div>
            </div>
            <div className="p-8 bg-white/5 rounded-[30px] border border-white/5 flex items-center gap-5">
                <div className="h-12 w-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400">
                    <Share2 className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-white/40 mb-1">Quick Share</p>
                    <p className="text-sm font-bold">Send to WhatsApp or Mail</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}