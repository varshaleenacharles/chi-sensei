// MongoDB document structure types based on your KMRL database
export interface MongoDocument {
  _id: {
    $oid: string;
  };
  body: string;
  mongoDoc: {
    source: {
      type: string;
      id: string;
    };
    source_file: {
      name: string;
      mime: string;
      size: string;
      base64: string;
      sha256: string;
    };
    summary: {
      text: string;
      parsed: {
        summary: string[];
        department: string[];
        urgency: string;
        decision_support: string;
      };
      model: string;
      tokens: string;
    };
    createdAt: string;
    tags: string[];
  };
}

// Transformed document for UI display
export interface KnowledgeHubDocument {
  id: string;
  title: string;
  source: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  summary: string[];
  departments: string[];
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  decisionSupport: string;
  createdAt: string;
  tags: string[];
  status: 'New' | 'Under Review' | 'Approved' | 'Rejected';
  assignedTo?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

// API response structure
export interface MongoApiResponse {
  documents: MongoDocument[];
  total: number;
  page: number;
  limit: number;
}
