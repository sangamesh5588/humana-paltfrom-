import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { ExpertApi } from '../../../shared/api/expert.api';

// Step Component Imports
import ChooseExperienceStep from '../components/steps/ChooseExperienceStep';
import BasicInfoStep from '../components/steps/BasicInfoStep';
import IntroVideoStep from '../components/steps/IntroVideoStep';
import AboutSessionStep from '../components/steps/AboutSessionStep';
import PricingStep from '../components/steps/PricingStep';
import AdminReviewStep from '../components/steps/AdminReviewStep';

export const CreateSessionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const existingSessionData = route.params?.sessionData;
  const existingSessionId = route.params?.sessionId || existingSessionData?.id;

  // Multi-step Wizard Step index: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<string | null>(null);
  
  // About Structured Fields
  const [explanation, setExplanation] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [timeline] = useState([
    { duration: '0–10 min', activity: 'Introduction' },
    { duration: '10–20 min', activity: 'Understand Your Goal' },
    { duration: '20–40 min', activity: 'Main Discussion' },
    { duration: '40–55 min', activity: 'Action Plan' },
    { duration: '55–60 min', activity: 'Questions' }
  ]);
  
  const [audienceList, setAudienceList] = useState([
    { id: 'students', label: 'Students', selected: false },
    { id: 'freshers', label: 'Freshers', selected: false },
    { id: 'professionals', label: 'Working Professionals', selected: false },
    { id: 'founders', label: 'Founders', selected: false },
  ]);

  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [newOutcome, setNewOutcome] = useState('');

  // Booking questions (becomes custom form)
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');

  // Rules
  const [cameraRequired, setCameraRequired] = useState(true);
  const [micRequired, setMicRequired] = useState(true);

  // Pricing
  const [duration, setDuration] = useState<number>(60);
  const [price, setPrice] = useState<string>('');

  // Database session ID once created
  const [sessionId, setSessionId] = useState<string | null>(existingSessionId || null);

  // Dynamic user credentials list
  const [experiences, setExperiences] = useState<Array<{ id: string; name: string; verified: boolean; verificationStatus?: string; type: string }>>([]);

  React.useEffect(() => {
    const prefillSessionData = (data: any) => {
      if (!data) return;
      if (data.id) setSessionId(data.id);
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.language) setLanguage(data.language);
      if (data.category) setCategory(data.category);
      if (data.thumbnailUrl) setThumbnailFile(data.thumbnailUrl);
      if (data.videoUrl) setVideoFile(data.videoUrl);
      if (data.explanation) setExplanation(data.explanation);
      if (data.topics && Array.isArray(data.topics)) setTopics(data.topics);
      if (data.outcomes && Array.isArray(data.outcomes)) setOutcomes(data.outcomes);
      if (data.bookingQuestions && Array.isArray(data.bookingQuestions)) setQuestions(data.bookingQuestions);
      if (data.durationMinutes) setDuration(data.durationMinutes);
      if (data.priceAmount) setPrice(String(data.priceAmount));
      
      // Jump to Step 2 (Basic Info) directly when editing
      setCurrentStep(2);
    };

    if (existingSessionData) {
      prefillSessionData(existingSessionData);
    } else if (existingSessionId) {
      ExpertApi.getSessionDetails(existingSessionId).then((data) => {
        prefillSessionData(data);
      }).catch(() => {});
    }
  }, [existingSessionData, existingSessionId]);

  React.useEffect(() => {
    const loadRealData = async () => {
      try {
        setLoading(true);
        const [profileData] = await Promise.all([
          ExpertApi.getProfile()
        ]);

        const realExperiencesList: Array<{ id: string; name: string; verified: boolean; verificationStatus: string; type: string }> = [];
        
        if (profileData.experience && profileData.experience.length > 0) {
          profileData.experience.forEach((exp: any) => {
            realExperiencesList.push({
              id: exp.id,
              name: `${exp.title} at ${exp.company}`,
              verified: exp.verified || false,
              verificationStatus: exp.verificationStatus || (exp.verified ? 'VERIFIED' : 'UNVERIFIED'),
              type: 'career'
            });
          });
        }

        if (profileData.education && profileData.education.length > 0) {
          profileData.education.forEach((edu: any) => {
            realExperiencesList.push({
              id: edu.id,
              name: `${edu.degree} from ${edu.school}`,
              verified: edu.verified || false,
              verificationStatus: edu.verificationStatus || (edu.verified ? 'VERIFIED' : 'UNVERIFIED'),
              type: 'education'
            });
          });
        }

        setExperiences(realExperiencesList);
        const firstVerified = realExperiencesList.find((e) => e.verified || e.verificationStatus === 'VERIFIED');
        if (firstVerified) {
          setSelectedExperience(firstVerified.id);
        }
      } catch (err) {
        console.error('Error loading real profile experiences:', err);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, []);

  const handleVerifyPress = (id: string) => {
    const expObj = experiences.find((e) => e.id === id);
    if (!expObj) return;

    if (expObj.verificationStatus === 'PENDING') {
      navigation.navigate('ExpertPending');
    } else if (expObj.type === 'career') {
      navigation.navigate('ExpertJourney', { typeSlug: 'career', experienceId: expObj.id });
    } else if (expObj.type === 'education') {
      navigation.navigate('ExpertJourney', { typeSlug: 'education', educationId: expObj.id });
    } else {
      navigation.navigate('ExpertCatalog');
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!selectedExperience) {
        Alert.alert('Selection Required', 'Please select a verified experience to base this session on.');
        return;
      }
      const expObj = experiences.find(e => e.id === selectedExperience);
      if (!expObj || !(expObj.verified || expObj.verificationStatus === 'VERIFIED')) {
        Alert.alert(
          'Verification Required',
          'Only VERIFIED experience or education background records can be used to create sessions. Please submit proof to verify your experience first.',
          [
            { text: 'OK', style: 'cancel' },
            { 
              text: 'Verify Now', 
              onPress: () => expObj && handleVerifyPress(expObj.id) 
            }
          ]
        );
        return;
      }
    }

    if (currentStep === 2) {
      if (!title.trim() || !description.trim()) {
        Alert.alert('Required Fields', 'Please fill in the Session Title and Description to continue.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!thumbnailFile) {
        Alert.alert('Thumbnail Image Required', 'Please upload a thumbnail image to continue. (Intro Video is optional)');
        return;
      }
    }

    if (currentStep === 4) {
      if (!explanation.trim()) {
        Alert.alert('Explanation Required', 'Please explain what this session is about.');
        return;
      }
      if (topics.length === 0) {
        Alert.alert('Topics Required', 'Please add at least 1 topic covered in this session.');
        return;
      }
      if (audienceList.filter(a => a.selected).length === 0) {
        Alert.alert('Target Audience Required', 'Please select at least 1 target audience for this session.');
        return;
      }
      if (outcomes.length === 0) {
        Alert.alert('Outcomes Required', 'Please add at least 1 expected outcome for learners.');
        return;
      }
      if (questions.length === 0) {
        Alert.alert('Learner Questions Required', 'Please add at least 1 preparation question for learners.');
        return;
      }
    }

    // Step 5 Submit to Supabase PostgreSQL when moving to Step 6 (Final Verification)
    if (currentStep === 5) {
      if (!price.trim()) {
        Alert.alert('Price Required', 'Please select or enter a price for your session.');
        return;
      }
      setLoading(true);
      try {
        const draft = await ExpertApi.createSession({
          title,
          description,
          language: language || 'English',
          category: category || 'Career Strategy',
          explanation,
          topics,
          timeline,
          targetAudience: audienceList.filter(a => a.selected).map(a => a.label),
          outcomes,
          bookingQuestions: questions,
          rules: { cameraRequired, micRequired, recordingAllowed: false },
          durationMinutes: duration,
          priceAmount: parseInt(price) || 1499,
          linkedBadgeId: selectedExperience,
          videoUrl: videoFile,
          thumbnailUrl: thumbnailFile,
        });

        if (draft && draft.id) {
          setSessionId(draft.id);
          await ExpertApi.submitCreatedSession(draft.id);
          setCurrentStep(6);
        } else {
          Alert.alert('Session Creation Error', 'Could not save session draft to server.');
        }
      } catch (err: any) {
        console.warn('Session submission error:', err?.response?.data || err?.message || err);
        const errMsg = err?.response?.data?.message || err?.message || 'Failed to create session. Please check your inputs and try again.';
        Alert.alert(
          'Session Creation Error', 
          Array.isArray(errMsg) ? errMsg.join('\n') : String(errMsg)
        );
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : Math.max(insets.top, 20);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ChooseExperienceStep
            selectedExperience={selectedExperience}
            onSelectExperience={setSelectedExperience}
            onAddNewExperience={() => navigation.navigate('VerificationCatalog')}
            onVerifyPress={handleVerifyPress}
            experiences={experiences}
          />
        );
      case 2:
        return (
          <BasicInfoStep
            title={title}
            onChangeTitle={setTitle}
            description={description}
            onChangeDescription={setDescription}
            language={language}
            onChangeLanguage={setLanguage}
            category={category}
            onChangeCategory={setCategory}
          />
        );
      case 3:
        return (
          <IntroVideoStep 
            videoFile={videoFile} 
            onUploadVideo={setVideoFile} 
            thumbnailFile={thumbnailFile}
            onUploadThumbnail={setThumbnailFile}
          />
        );
      case 4:
        return (
          <AboutSessionStep
            explanation={explanation}
            onChangeExplanation={setExplanation}
            topics={topics}
            newTopic={newTopic}
            onChangeNewTopic={setNewTopic}
            onAddTopic={() => {
              if (newTopic.trim()) {
                setTopics(prev => [...prev, newTopic.trim()]);
                setNewTopic('');
              }
            }}
            onRemoveTopic={(idx) => setTopics(prev => prev.filter((_, i) => i !== idx))}
            timeline={timeline}
            audienceList={audienceList}
            onToggleAudience={(id) => {
              setAudienceList(prev => prev.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
            }}
            outcomes={outcomes}
            newOutcome={newOutcome}
            onChangeNewOutcome={setNewOutcome}
            onAddOutcome={() => {
              if (newOutcome.trim()) {
                setOutcomes(prev => [...prev, newOutcome.trim()]);
                setNewOutcome('');
              }
            }}
            onRemoveOutcome={(idx) => setOutcomes(prev => prev.filter((_, i) => i !== idx))}
            questions={questions}
            newQuestion={newQuestion}
            onChangeNewQuestion={setNewQuestion}
            onAddQuestion={() => {
              if (newQuestion.trim()) {
                setQuestions(prev => [...prev, newQuestion.trim()]);
                setNewQuestion('');
              }
            }}
            onRemoveQuestion={(idx) => setQuestions(prev => prev.filter((_, i) => i !== idx))}
            cameraRequired={cameraRequired}
            onChangeCameraRequired={setCameraRequired}
            micRequired={micRequired}
            onChangeMicRequired={setMicRequired}
          />
        );
      case 5:
        return (
          <PricingStep
            duration={duration}
            onChangeDuration={setDuration}
            price={price}
            onChangePrice={setPrice}
          />
        );
      case 6:
        return (
          <AdminReviewStep
            sessionId={sessionId}
            onSimulateApprove={async () => {
              navigation.navigate('ExpertBottomTabs', { screen: 'ExpertSessionsTab' });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />

      {/* App Bar */}
      <View style={[styles.appBar, { paddingTop: topInset + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handlePrevStep}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Create Session</Text>
        <Text style={styles.stepCounter}>{currentStep} / 6</Text>
      </View>

      {/* Progress Tracker */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${(currentStep / 6) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#0369A1" />
            <Text style={styles.loadingText}>Saving Session to Database...</Text>
          </View>
        ) : (
          renderStepContent()
        )}
      </ScrollView>

      {/* Bottom Actions Bar */}
      {currentStep < 6 && !loading && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.prevBtn} onPress={handlePrevStep}>
            <Text style={styles.prevBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNextStep}>
            <Text style={styles.nextBtnText}>{currentStep === 5 ? 'Submit' : 'Continue'}</Text>
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#0369A1',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  prevBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  nextBtn: {
    flex: 1,
    backgroundColor: '#0369A1',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CreateSessionScreen;
