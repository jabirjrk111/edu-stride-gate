import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut, Calendar, BookOpen, User, Shield } from "lucide-react";
import AttendanceCard from "@/components/AttendanceCard";
import StudyMaterialsList from "@/components/StudyMaterialsList";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface Profile {
  full_name: string;
  student_id: string;
  email: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Error loading profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 bg-gradient-primary">
                <AvatarFallback className="bg-transparent text-primary-foreground font-semibold">
                  {profile?.full_name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-foreground">{profile?.full_name}</h1>
                <p className="text-sm text-muted-foreground">ID: {profile?.student_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button onClick={() => navigate("/admin")} variant="secondary" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">Here's what's happening with your academics</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="border-border shadow-soft hover:shadow-strong transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Attendance
                </CardTitle>
                <Calendar className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">--</div>
                <p className="text-xs text-muted-foreground mt-1">Loading records...</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft hover:shadow-strong transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Study Materials
                </CardTitle>
                <BookOpen className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">--</div>
                <p className="text-xs text-muted-foreground mt-1">Available resources</p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-soft hover:shadow-strong transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Profile Status
                </CardTitle>
                <User className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">Active</div>
                <p className="text-xs text-muted-foreground mt-1">{profile?.email}</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <AttendanceCard />
          </div>

          {/* Study Materials Section */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <StudyMaterialsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
