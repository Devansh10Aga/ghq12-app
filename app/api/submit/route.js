import { sql } from '@vercel/postgres';

export async function POST(req) {
  const { responses, id } = await req.json();

  // Ensure responses is an array of integers
  const scores = responses.map((response) => parseInt(response, 10));

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

  try {
    // Insert the new test result into the database
    const insertResult = await sql`
      INSERT INTO test_results (user_id, score, interpretation, date)
      VALUES (${id}, ${totalScore}, ${interpretation}, NOW())
      RETURNING id;
    `;

    // Fetch all previous test results for the user
    const previousResults = await sql`
      SELECT score, interpretation, date
      FROM test_results
      WHERE user_id = ${id}
      ORDER BY date DESC;
    `;

    // Return the current score, interpretation, and previous results
    return new Response(
      JSON.stringify({
        score: totalScore,
        interpretation,
        previousResults: previousResults.rows,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Database insertion or query error:', error);
    return new Response(
      JSON.stringify({ message: 'Database error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
