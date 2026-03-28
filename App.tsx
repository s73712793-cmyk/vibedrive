import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// --- UPDATED IMPORTS TO MATCH YOUR ACTUAL FILES ---
import Index from "./pages/Index";
import Auth from "./pages/AuthPage";      // Matches AuthPage.tsx
import History from "./pages/HistoryPage"; // Matches HistoryPage.tsx
import Edit from "./pages/EditReply";     // Matches EditReply.tsx
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for sign-in/sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Professional loading state for your BCA demo
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 shadow-lg shadow-purple-500/20"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-center" richColors />
        <BrowserRouter>
          <Routes>
            {/* Login/Signup Page */}
            <Route 
              path="/auth" 
              element={!session ? <Auth /> : <Navigate to="/" replace />} 
            />

            {/* Main Generator Dashboard */}
            <Route 
              path="/" 
              element={session ? <Index /> : <Navigate to="/auth" replace />} 
            />

            {/* Your History Page (HistoryPage.tsx) */}
            <Route 
              path="/history" 
              element={session ? <History /> : <Navigate to="/auth" replace />} 
            />

            {/* The AI Result Page (EditReply.tsx) */}
            <Route 
              path="/edit/:id" 
              element={session ? <Edit /> : <Navigate to="/auth" replace />} 
            />

            {/* Fallback for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;