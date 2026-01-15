
export enum QuestionCategory {
  TEXT_TYPE = 'Tekstsoort',
  AUTHOR_PURPOSE = 'Bedoeling van de schrijver',
  MAIN_IDEA = 'Hoofdgedachte',
  WWWWWH = 'WWWWWH-vragen',
  OPINION = 'Mening & Reflectie'
}

export interface Question {
  id: string;
  category: QuestionCategory;
  text: string;
  options?: string[]; // Optional for open questions
  correctAnswerIndex?: number; // Optional for open questions
  explanation?: string;
  isOpen?: boolean;
}

export interface QuizData {
  id: string;
  title: string;
  fullText: string;
  questions: Question[];
  createdAt: number;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentName: string;
  answers: { [questionId: string]: string | number };
  score: number; // Only for MC questions
  maxScore: number;
  submittedAt: number;
}
