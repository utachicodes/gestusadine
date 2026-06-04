import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
}

interface LessonQuizProps {
    questions: Question[];
    onComplete: (score: number) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({ questions, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;

        const correct = selectedOption === questions[currentQuestion].correctAnswer;
        if (correct) setScore(s => s + 1);
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setQuizCompleted(true);
            onComplete(score + (selectedOption === questions[currentQuestion].correctAnswer ? 1 : 0)); // Add last point if correct
        }
    };

    if (quizCompleted) {
        return (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-islamic-gold/20 rounded-full flex items-center justify-center mx-auto text-islamic-gold mb-6">
                    <Trophy className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Quiz Completed!</h3>
                <p className="text-muted-foreground">
                    You scored <span className="text-islamic-gold font-bold text-xl">{score}</span> out of <span className="text-foreground font-bold">{questions.length}</span>
                </p>

                {score === questions.length && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2">
                        Perfect Score! +50 Bonus Points
                    </Badge>
                )}

                <div className="pt-6">
                    <Button onClick={() => {
                        setQuizCompleted(false);
                        setCurrentQuestion(0);
                        setSelectedOption(null);
                        setIsAnswered(false);
                        setScore(0);
                    }} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Retake Quiz
                    </Button>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8 flex justify-between items-center text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl md:text-2xl font-bold leading-relaxed">
                    {question.text}
                </h3>

                <div className="space-y-3">
                    {question.options.map((option, idx) => {
                        let buttonStyle = "w-full justify-start text-left h-auto py-4 px-6 text-base hover:bg-muted/50 transition-all duration-200 border-2";

                        if (isAnswered) {
                            if (idx === question.correctAnswer) {
                                buttonStyle += " bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-50";
                            } else if (idx === selectedOption) {
                                buttonStyle += " bg-red-50 border-red-500 text-red-700 hover:bg-red-50";
                            } else {
                                buttonStyle += " border-transparent opacity-50";
                            }
                        } else {
                            buttonStyle += selectedOption === idx
                                ? " border-islamic-gold bg-islamic-gold/5 text-foreground"
                                : " border-transparent bg-secondary/30";
                        }

                        return (
                            <Button
                                key={idx}
                                variant="ghost"
                                className={buttonStyle}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isAnswered}
                            >
                                <div className="flex items-center w-full">
                                    <span className="flex-1">{option}</span>
                                    {isAnswered && idx === question.correctAnswer && (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-2" />
                                    )}
                                    {isAnswered && idx === selectedOption && idx !== question.correctAnswer && (
                                        <XCircle className="w-5 h-5 text-red-600 ml-2" />
                                    )}
                                </div>
                            </Button>
                        );
                    })}
                </div>

                <div className="pt-6 flex justify-end">
                    {!isAnswered ? (
                        <Button
                            onClick={handleCheckAnswer}
                            disabled={selectedOption === null}
                            className="bg-islamic-gold hover:bg-islamic-gold-600 text-white min-w-[120px]"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-primary hover:bg-primary/90 min-w-[120px]"
                        >
                            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
