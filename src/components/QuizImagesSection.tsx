import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  image_url: string | null;
  quiz_date: string;
  colleges: { name: string };
}

const QuizImagesSection = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    fetchQuizzesWithImages();
  }, []);

  const fetchQuizzesWithImages = async () => {
    const { data, error } = await supabase
      .from("quizzes")
      .select(`
        id,
        title,
        image_url,
        quiz_date,
        colleges(name)
      `)
      .not("image_url", "is", null)
      .order("quiz_date", { ascending: false })
      .limit(12);

    if (!error && data) {
      setQuizzes(data);
    }
  };

  return (
    <section id="images" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quiz{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of quiz competitions and events
          </p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quiz images available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quizzes.map((quiz, index) => (
              <Card 
                key={quiz.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={quiz.image_url || ""}
                      alt={quiz.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {quiz.colleges?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(quiz.quiz_date).toLocaleDateString()}
                        </p>
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

export default QuizImagesSection;
