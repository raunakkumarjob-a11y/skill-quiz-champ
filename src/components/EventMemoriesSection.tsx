import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Calendar } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  event_date: string | null;
  created_at: string;
}

const EventMemoriesSection = () => {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from("event_memories")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(12);

    if (!error && data) {
      setMemories(data);
    }
  };

  return (
    <section id="memories" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Event{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Memories
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relive the moments from our amazing quiz competitions and events
          </p>
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No memories uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memories.map((memory, index) => (
              <Card 
                key={memory.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={memory.image_url}
                      alt={memory.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                          {memory.title}
                        </h3>
                        {memory.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {memory.description}
                          </p>
                        )}
                        {memory.event_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(memory.event_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventMemoriesSection;
