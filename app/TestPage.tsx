import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { roomService } from './services/roomService';

interface Question {
  id: number;
  question_text: string;
  options: Array<{ id: number; option_text: string }>;
  correct_answer: string; // Add the correct_answer field
}

const TestPage = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!roomId || isNaN(Number(roomId))) {
          throw new Error("Invalid Room ID");
        }
        const response = await roomService.getQuestions(Number(roomId));
        console.log("Response Data:", response.data);

        const questionsData = response.data.data.questions;
        console.log("Questions Data:", questionsData);

        if (Array.isArray(questionsData)) {
          setQuestions(questionsData);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        Alert.alert("Error", "Failed to load questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchQuestions();
    }
  }, [roomId]);

  const handleAnswerChange = (questionId: number, selectedAnswer: string) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: selectedAnswer }));
  };

  const handleSubmitAnswer = (questionId: number) => {
    const selectedAnswer = answers[questionId];
    const question = questions.find(q => q.id === questionId);
    
    if (question) {
      const isCorrect = question.correct_answer === selectedAnswer;
      setResults(prevResults => ({ ...prevResults, [questionId]: isCorrect }));
      Alert.alert("Result", isCorrect ? "Correct!" : "Incorrect");
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Test Page</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        questions.map((question) => (
          <View key={question.id} className="mb-4">
            <Text className="text-lg font-semibold">{question.question_text}</Text>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleAnswerChange(question.id, option.option_text)}
                className={`p-2 rounded-md border ${
                  answers[question.id] === option.option_text ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                <Text>{option.option_text}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => handleSubmitAnswer(question.id)}
              className="bg-green-500 rounded-md p-2 mt-2"
              disabled={!answers[question.id] || isLoading}
            >
              <Text className="text-white text-center font-bold">Submit Answer</Text>
            </TouchableOpacity>
            {results[question.id] !== undefined && (
              <Text className={`mt-2 font-bold ${results[question.id] ? "text-green-500" : "text-red-500"}`}>
                {results[question.id] ? "Correct!" : "Incorrect"}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default TestPage;