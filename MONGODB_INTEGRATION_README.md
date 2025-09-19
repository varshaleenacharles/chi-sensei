# MongoDB Integration with Chi-Sensei Knowledge Hub

## Overview
This document describes the integration of MongoDB data with the Chi-Sensei application's Knowledge Hub feature in the Manager Dashboard.

## Database Structure

### MongoDB Connection
- **URI**: `mongodb+srv://231401067_db_user:Mythili123@kmrlcluster.6gml2en.mongodb.net/?retryWrites=true&w=majority&appName=KMRLCluster`
- **Database**: `kmrl_documents`
- **Collection**: `documents`

### Document Schema
```typescript
interface MongoDocument {
  _id: { $oid: string };
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
```

## Features Implemented

### 1. AI-Generated Summary Display
- **Location**: Manager Dashboard → Knowledge Hub Tab
- **Features**:
  - Displays AI-generated summaries as bullet points
  - Shows decision support information
  - Color-coded urgency levels (Critical, High, Medium, Low)
  - Department-based filtering

### 2. Document Management
- **Document Status Tracking**: New, Under Review, Approved, Rejected
- **Assignment System**: Assign documents to staff members
- **Search Functionality**: Search across summaries, titles, and tags
- **Department Filtering**: Filter by Finance, Projects, Legal, Health & Safety, Systems & Operations

### 3. Visual Enhancements
- **Card Layout**: Modern card design with hover effects
- **Color Coding**: 
  - Blue: AI Summary section
  - Amber: Decision Support section
  - Department-specific colors for badges
- **Status Indicators**: Visual status badges with appropriate colors
- **Priority Levels**: Urgency-based priority display

## File Structure

```
src/
├── types/
│   └── mongodb.ts              # TypeScript interfaces for MongoDB data
├── services/
│   └── mongoService.ts         # Service layer for MongoDB operations
└── components/
    └── ManagerDashboard.tsx    # Updated with Knowledge Hub integration
```

## Key Components

### MongoService Class
- **Singleton Pattern**: Ensures single instance across the application
- **Data Transformation**: Converts MongoDB documents to UI-friendly format
- **Mock Implementation**: Currently uses mock data (ready for real MongoDB integration)
- **Methods**:
  - `fetchDocuments()`: Retrieves documents from MongoDB
  - `getDocuments()`: Returns transformed documents
  - `filterByDepartment()`: Filters by department
  - `searchDocuments()`: Search functionality
  - `updateDocumentStatus()`: Updates document status
  - `assignDocument()`: Assigns documents to staff

### Knowledge Hub UI
- **Document Cards**: Enhanced card layout with AI summary display
- **Search & Filter**: Real-time search and department filtering
- **Action Buttons**: Assign, Review, Approve, View Document
- **Status Management**: Visual status indicators and updates

## Sample Data Integration

The system currently uses the provided MongoDB document structure:

```json
{
  "_id": { "$oid": "68ccda363a4d5a2d2ed18433" },
  "body": "---------- Forwarded message ---------\r\nFrom: MYTHILI K 231401067...",
  "mongoDoc": {
    "source": { "type": "email", "id": "unknown" },
    "source_file": {
      "name": "During the routine inspection conducted on 10th September 2025 (1).pdf",
      "mime": "application/pdf",
      "size": "283 kB"
    },
    "summary": {
      "parsed": {
        "summary": [
          "Submit a detailed structural integrity report to the Commissioner of Metro Rail Safety within five days.",
          "Enforce temporary restrictions on passenger movement near the affected viaduct areas.",
          "Coordinate with operations staff to issue public announcements and install warning signboards for safety.",
          "Fast-track approval of contractor invoices for emergency repairs by 15th September to ensure timely work.",
          "Arrange refresher safety training for approximately 150 frontline staff within the next two weeks."
        ],
        "department": ["Finance", "Projects", "Safety & Operations"],
        "urgency": "High",
        "decision_support": "Immediate compliance with safety recommendations is essential to prevent potential hazards during the monsoon season and ensure passenger safety."
      }
    },
    "createdAt": "2025-09-19T04:19:56.249Z",
    "tags": ["finance", "projects", "safetyops"]
  }
}
```

## Usage Instructions

### For Managers
1. Navigate to Manager Dashboard
2. Click on "Knowledge Hub" tab
3. Use search bar to find specific documents or summaries
4. Filter by department using the dropdown
5. Review AI-generated summaries and decision support information
6. Assign documents to staff members
7. Update document status as needed

### For Developers
1. **Real MongoDB Integration**: Replace mock data in `mongoService.ts` with actual MongoDB queries
2. **Authentication**: Add proper authentication for MongoDB connection
3. **Error Handling**: Implement comprehensive error handling for database operations
4. **Caching**: Add caching layer for improved performance
5. **Real-time Updates**: Implement real-time document updates using MongoDB change streams

## Future Enhancements

1. **Real-time Sync**: Live updates when new documents are added to MongoDB
2. **Advanced Search**: Full-text search across document content
3. **Document Preview**: In-app PDF/document preview
4. **Notification System**: Alerts for new high-priority documents
5. **Analytics**: Track document processing metrics and staff performance
6. **Workflow Automation**: Automated document routing based on content analysis

## Security Considerations

1. **Connection Security**: Use environment variables for MongoDB credentials
2. **Data Validation**: Validate all incoming data from MongoDB
3. **Access Control**: Implement role-based access to documents
4. **Audit Logging**: Log all document access and modifications
5. **Data Encryption**: Encrypt sensitive document content

## Performance Optimization

1. **Pagination**: Implement pagination for large document sets
2. **Lazy Loading**: Load document content on demand
3. **Indexing**: Optimize MongoDB indexes for search queries
4. **Caching**: Cache frequently accessed documents
5. **Compression**: Compress large document content

This integration provides a robust foundation for managing AI-processed documents within the KMRL system, enabling efficient knowledge management and decision support for managers.
