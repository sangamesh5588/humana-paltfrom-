export interface ExtractedParameters {
  goal?: string;
  stage?: string;
  industry?: string;
  region?: string;
  birthDistrict?: string;
  college?: string;
  language?: string;
}

export interface GeminiResponse {
  reply: string;
  extractedParameters?: ExtractedParameters;
  isReadyToRecommend: boolean;
}
