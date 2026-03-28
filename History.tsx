import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, History as HistoryIcon, MessageSquare, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ARCard from "@/components/ARCard";

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("email_replies")
          .select("*")
          .eq("user_id", user.id) // ONLY shows Soniya's data
          .order("created_at", { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (e) {
        // Demo Fallback if Docker is down
        const localData = JSON.parse(localStorage.getItem("vibe_history") || "[]");
        setHistory(localData);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const deleteEntry = async (id: string) => {
    try {
      await supabase.from("email_replies").delete().eq("id", id);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success("Entry removed");
    } catch (e) {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 relative"
         style={{ 
           background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1515515101999-f1515494a8c5?auto=format&fit=crop&w=2000') !important`,
           backgroundSize: 'cover !important',
           backgroundPosition: 'center !important',
           backgroundAttachment: 'fixed !important'
         }}>
      
      {/* Back Button */}
      <div className="w-full max-w-4xl flex justify-start mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="text-white/40 hover:text-white hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Generator
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-4xl w-full space-y-8"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-purple-600/20 rounded-2xl border border-purple-500/30">
            <HistoryIcon className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">Vibe History</h1>
            <p className="text-white/30 text-xs uppercase tracking-widest">Restored Personal Drafts</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/20">Loading your history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-white/5 text-white/20">
            No drafts saved yet. Start generating!
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ARCard className="glass border border-white/10 p-6 rounded-2xl hover:border-purple-500/30 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4 text-[10px] text-purple-400 font-bold uppercase tracking-tighter">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> {item.tone_detected || "Formal"}
                        </span>
                      </div>
                      <p className="text-white/80 line-clamp-2 text-sm italic">"{item.original_email}"</p>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-purple-200 text-xs line-clamp-2">
                        {item.ai_draft}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/edit/${item.id}`)}
                        className="bg-purple-600 hover:bg-purple-500 text-xs h-8"
                      >
                        View
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => deleteEntry(item.id)}
                        className="text-white/10 hover:text-red-500 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ARCard>
              </motion.div>
            ))}
          </div>
        )}

        <footer className="text-center pt-10 opacity-10 text-[9px] text-white uppercase tracking-[0.4em] font-bold">
          Data Restore Engine Active • BCA Final Project
        </footer>
      </motion.div>
    </div>
  );
}