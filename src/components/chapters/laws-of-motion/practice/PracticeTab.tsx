import React from "react";
import MCQQuestions from "./MCQQuestions";
import { questionBank } from "./questionBank";

const PracticeTab: React.FC = () => {
  return <MCQQuestions questions={questionBank} />;
};

export default PracticeTab;
