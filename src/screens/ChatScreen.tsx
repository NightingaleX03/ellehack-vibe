import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {TextInput, Button, Card, Text, ActivityIndicator} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {geminiService} from '../services/gemini';
import {storage} from '../utils/storage';

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({navigation}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm CityBuddy AI. Ask me anything about the city - places to visit, events, food recommendations, or general city info!",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const profile = await storage.getProfile();
      if (profile) {
        const response = await geminiService.chat(userMessage.text, profile);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble right now. Please try again.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}>
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}>
            <Card
              style={[
                styles.messageCard,
                message.isUser ? styles.userCard : styles.aiCard,
              ]}>
              <Card.Content>
                <Text variant="bodyMedium">{message.text}</Text>
              </Card.Content>
            </Card>
          </View>
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>CityBuddy is typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Ask me anything about the city..."
          value={inputText}
          onChangeText={setInputText}
          style={styles.input}
          multiline
          onSubmitEditing={handleSend}
          disabled={loading}
        />
        <Button
          mode="contained"
          onPress={handleSend}
          style={styles.sendButton}
          disabled={loading || !inputText.trim()}
          icon="send">
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageCard: {
    maxWidth: '80%',
  },
  userCard: {
    backgroundColor: '#2196f3',
  },
  aiCard: {
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: 'center',
  },
});

