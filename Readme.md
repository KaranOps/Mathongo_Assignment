# AI-Powered Question Similarity & Replica Detector

- **Demo Video:** [Click](https://youtu.be/rSCuGygE0bg?feature=shared) 

## What This Project Does

This is a backend tool that finds similar or duplicate questions in educational datasets. 

The system takes a list of questions, compares them using AI, and tells you which ones are duplicates. It gives you the results in JSON or CSV files.

## Key Features

- Uses Google Gemini API to understand question meanings
- Calculates similarity scores between questions
- Flags questions that are too similar as duplicates
- Clean, organized code structure
- Saves results in JSON and CSV formats
- Simple REST API with basic endpoints
- Combines different similarity methods for better results

## What I Tried & Learned

- Built a **nested** cosine-only version to grasp basics.  
- Added **Manhattan distance** for another similarity view.  
- Used a **sigmoid formula** to map distances into a 0–1 range.  
- Created a **Faiss-based version** for fast search on large sets but not improved that much time.  
- Structured code into **controllers**, **routes**, **services**, **utils**, and **scripts**. 

## What I Built and Learned

This project helped me learn about AI embeddings, similarity calculations, and backend development.

- Built a system that compares every question with every other question
- Used Google Gemini API to convert questions into number vectors
- Added different ways to measure similarity between questions
- Made the code modular with separate files for different functions
- Created a command-line script to test the system
- Built a REST API for web integration
- Generated detailed output files for analysis
- Added proper error handling and configuration

## Setup Instructions

### What You Need
- Node.js version 16 or higher
- npm (comes with Node.js)
- Google Gemini API key

### How to Install

1. **Download the project:**
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Install required packages:**
   ```bash
   npm install
   ```

3. **Add your API key:**
   
   Create a `.env` file and add:
   ```text
   GEMINI_API_KEY=your-real-api-key-here
   PORT=3000
   ```

## How to Run

### Test with Sample Questions

Run the analysis on sample data:

```bash
node scripts/testSampleQuestions.js
```

This creates result files in the `/output/` folder.

### Start the Web Server

Start the API server:

```bash
node app.js
```

### API Endpoints

- **GET** `/health` — Check if server is working
- **GET** `/sample-questions` — Get test questions
- **POST** `/replica-check` — Find similar questions

### Example API Request

Send questions to check for duplicates:

```json
{
  "questions": [
    "What is the SI unit of electric current?",
    "Define the SI unit of electrical current."
  ],
  "threshold": 0.8
}
```

## Project Structure

```
├── controllers/        # API logic
├── services/          # Main processing code
├── utils/             # Helper functions
├── routes/            # API routes
├── data/              # Sample questions
├── output/            # Result files
├── scripts/           # Test scripts
├── app.js             # Main server file
└── README.md          # This file
```

## Output Examples

### JSON Results
```json
{
  "metadata": {
    "total_questions": 30,
    "total_pairs": 435,
    "replica_pairs": 8,
    "threshold_used": 0.8
  },
  "replica_pairs": [
    {
      "question1": "What is the derivative of x^2?",
      "question2": "Find the rate of change of x squared",
      "similarity_score": 0.8654,
      "is_replica": true
    }
  ]
}
```

### CSV Results
```csv
Question1,Question2,Similarity_Score,Is_Replica
"What is the derivative of x^2?","Find the rate of change of x squared",0.8654,true
```

## How It Works

1. **Convert Questions to Numbers**: Uses Google Gemini to turn each question into a list of 768 numbers
2. **Compare Questions**: Calculates how similar the number lists are using math
3. **Find Duplicates**: Questions with similarity over 0.8 are marked as duplicates

## API Documentation

### Check Server Health
```http
GET /api/questions/health
```

Returns:
```json
{
  "success": true,
  "status": "OK",
  "message": "Server is running"
}
```

### Get Sample Questions
```http
GET /api/questions/sample-questions
```

Returns:
```json
{
  "success": true,
  "questions": ["Question 1", "Question 2", ...],
  "total_questions": 30
}
```

### Find Similar Questions
```http
POST /api/questions/replica-check
```

Send:
```json
{
  "questions": ["Question 1", "Question 2", ...],
  "threshold": 0.8
}
```

Get back:
```json
{
  "success": true,
  "total_pairs": 3,
  "replica_count": 1,
  "replicas": [...],
  "all_results": [...]
}
```

## License

MIT License

**Karan Kumar**  
*MERN Developer & AI Enthusiast*