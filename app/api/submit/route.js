export async function POST(req) {
    
      const { responses } = await req.json();
  
      // Ensure responses is an array of integers
      const scores = responses.map(response => parseInt(response, 10));
  
      // Calculate the total score
      const totalScore = scores.reduce((acc, score) => acc + score, 0);
  
      // Interpretation of the score
      let interpretation = '';
      if (totalScore < 12) {
        interpretation = 'Low level of psychological distress';
      } else if (totalScore < 24) {
        interpretation = 'Moderate level of psychological distress';
      } else {
        interpretation = 'High level of psychological distress';
      }
  
      // Return the score and interpretation
      return Response.json({ score: totalScore, interpretation });
  }
  