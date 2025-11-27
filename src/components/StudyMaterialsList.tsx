import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, FileText } from "lucide-react";
import { format } from "date-fns";

interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  file_url: string | null;
  file_type: string | null;
  uploaded_at: string;
}

const StudyMaterialsList = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from("study_materials")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      console.error("Error fetching study materials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Study Materials
          </CardTitle>
          <CardDescription>Loading available resources...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          Study Materials
        </CardTitle>
        <CardDescription>Access your course materials and resources</CardDescription>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No study materials available yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {materials.map((material) => (
              <div
                key={material.id}
                className="flex flex-col p-4 rounded-lg border border-border bg-card hover:shadow-soft transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{material.title}</h3>
                    {material.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {material.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {material.subject}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(material.uploaded_at), "MMM d, yyyy")}
                  </span>
                  {material.file_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(material.file_url!, "_blank")}
                      className="gap-2"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyMaterialsList;
