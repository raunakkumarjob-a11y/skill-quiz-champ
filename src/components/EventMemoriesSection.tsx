import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Calendar, Eye, X } from "lucide-react";

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
  const [allMemories, setAllMemories] = useState<Memory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);

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

  const fetchAllMemories = async () => {
    const { data, error } = await supabase
      .from("event_memories")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAllMemories(data);
      setIsDialogOpen(true);
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {memories.map((memory, index) => (
                <Card 
                  key={memory.id}
                  className="group hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div 
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(memory)}
                    >
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

            <div className="text-center mt-10">
              <Button
                onClick={fetchAllMemories}
                variant="outline"
                className="border-2 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Eye className="mr-2 h-5 w-5" />
                View More
              </Button>
            </div>
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                All Event{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Memories
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {allMemories.map((memory) => (
                <Card key={memory.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={memory.image_url}
                      alt={memory.title}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(memory)}
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{memory.title}</h3>
                      {memory.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {memory.description}
                        </p>
                      )}
                      {memory.event_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(memory.event_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-sm border-none">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {selectedImage && (
              <div className="flex flex-col">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-muted-foreground mt-1">{selectedImage.description}</p>
                  )}
                  {selectedImage.event_date && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedImage.event_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default EventMemoriesSection;
