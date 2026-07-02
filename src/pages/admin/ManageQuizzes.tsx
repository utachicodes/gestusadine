import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useTr } from "@/lib/i18n";
import { getErrorMessage } from "@/types/errors";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

const EMPTY = {
  date: "",
  question: "",
  options: ["", "", "", ""],
  correctIndex: "0",
  explanation: "",
  difficulty: "easy" as const,
  category: "general",
};

export default function ManageQuizzes() {
  const tr = useTr();
  const quizzes = useQuery(api.quizzes.list) ?? [];
  const createQuiz = useMutation(api.quizzes.create);
  const updateQuiz = useMutation(api.quizzes.update);
  const removeQuiz = useMutation(api.quizzes.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedOptions = formData.options.filter((o) => o.trim());
      if (parsedOptions.length < 2) {
        toast.error(tr({ en: "At least 2 options required", fr: "Au moins 2 options requises" }));
        return;
      }
      const dateMs = new Date(formData.date).setHours(0, 0, 0, 0);
      const payload = {
        date: dateMs,
        question: formData.question,
        options: parsedOptions,
        correctIndex: parseInt(formData.correctIndex),
        explanation: formData.explanation || undefined,
        difficulty: formData.difficulty,
        category: formData.category,
      };

      if (editingId) {
        await updateQuiz({ id: editingId as Id<"dailyQuizzes">, ...payload });
        toast.success(tr({ en: "Quiz updated", fr: "Quiz mis à jour" }));
        setEditingId(null);
      } else {
        await createQuiz(payload);
        toast.success(tr({ en: "Quiz created", fr: "Quiz créé" }));
        setIsCreating(false);
      }
      setFormData({ ...EMPTY });
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEdit = (quiz: Doc<"dailyQuizzes">) => {
    setEditingId(quiz._id);
    setFormData({
      date: new Date(quiz.date).toISOString().split("T")[0],
      question: quiz.question,
      options: quiz.options.length >= 4 ? quiz.options : [...quiz.options, ...Array(4 - quiz.options.length).fill("")],
      correctIndex: quiz.correctIndex.toString(),
      explanation: quiz.explanation || "",
      difficulty: quiz.difficulty || "easy",
      category: quiz.category || "general",
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr({ en: "Delete this quiz?", fr: "Supprimer ce quiz ?" }))) return;
    try {
      await removeQuiz({ id: id as Id<"dailyQuizzes"> });
      toast.success(tr({ en: "Quiz deleted", fr: "Quiz supprimé" }));
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleOptionChange = (idx: number, value: string) => {
    const opts = [...formData.options];
    opts[idx] = value;
    setFormData({ ...formData, options: opts });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{tr({ en: "Manage Quizzes", fr: "Gérer les quiz" })}</h1>
          <p className="text-muted-foreground mt-1">{tr({ en: "Create and manage daily quizzes", fr: "Créez et gérez les quiz quotidiens" })}</p>
        </div>
        <Button onClick={() => { setIsCreating(true); setFormData({ ...EMPTY, date: new Date().toISOString().split("T")[0] }); }}>
          <Plus className="mr-2 h-4 w-4" /> {tr({ en: "New Quiz", fr: "Nouveau quiz" })}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? tr({ en: "Edit Quiz", fr: "Modifier le quiz" }) : tr({ en: "Create Quiz", fr: "Créer un quiz" })}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">{tr({ en: "Date", fr: "Date" })}</label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Question", fr: "Question" })}</label>
                <Input value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {formData.options.map((opt, idx) => (
                  <div key={idx}>
                    <label className="text-sm font-medium">{tr({ en: `Option ${idx + 1}`, fr: `Option ${idx + 1}` })}</label>
                    <Input value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} required />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Correct Option (0-based)", fr: "Option correcte (basée 0)" })}</label>
                <Input type="number" min="0" max="3" value={formData.correctIndex} onChange={(e) => setFormData({ ...formData, correctIndex: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">{tr({ en: "Explanation (optional)", fr: "Explication (optionnelle)" })}</label>
                <Input value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">{tr({ en: "Difficulty", fr: "Difficulté" })}</label>
                  <select className="w-full rounded-md border p-2" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as "easy" | "medium" | "hard" })}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">{tr({ en: "Category", fr: "Catégorie" })}</label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? tr({ en: "Update", fr: "Mettre à jour" }) : tr({ en: "Create", fr: "Créer" })}</Button>
                <Button type="button" variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); }}>
                  {tr({ en: "Cancel", fr: "Annuler" })}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {quizzes.length === 0 ? (
          <p className="text-muted-foreground">{tr({ en: "No quizzes yet.", fr: "Aucun quiz pour l'instant." })}</p>
        ) : (
          quizzes.map((quiz) => (
            <Card key={quiz._id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{new Date(quiz.date).toLocaleDateString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${quiz.difficulty === "easy" ? "bg-green-100 text-green-700" : quiz.difficulty === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <p className="font-medium">{quiz.question}</p>
                  <p className="text-sm text-muted-foreground mt-1">{quiz.options.join(" | ")}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(quiz)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(quiz._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
