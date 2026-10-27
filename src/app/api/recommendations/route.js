import { mockRecommendations } from '../../utils/MockData';

export async function POST(request) {
  try {
    const { postcode, budgetMin, budgetMax, mealOptions } = await request.json();

    // Validate input
    if (!postcode || !budgetMax || !mealOptions || mealOptions.length === 0) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, this would:
    // 1. Validate postcode using UK postcode API
    // 2. Get coordinates from postcode
    // 3. Query food delivery APIs (Deliveroo, Just Eat, Uber Eats)
    // 4. Use LLM to process and rank results
    // 5. Filter by budget and meal preferences

    const recommendations = mockRecommendations.filter(item => {
      const matchesBudget = item.price >= budgetMin && item.price <= budgetMax;
      const matchesMeal = mealOptions.some(meal => 
        item.categories.some(cat => 
          cat.toLowerCase().includes(meal.toLowerCase()) ||
          item.dishName.toLowerCase().includes(meal.toLowerCase()) ||
          item.description.toLowerCase().includes(meal.toLowerCase())
        )
      );
      return matchesBudget && matchesMeal;
    }).slice(0, 8); // Return max 8 recommendations

    // Simulate LLM ranking based on relevance
    const rankedRecommendations = recommendations.sort((a, b) => {
      // Sort by rating and then by price value
      const aScore = (a.rating || 4) * 10 + (budgetMax - a.price);
      const bScore = (b.rating || 4) * 10 + (budgetMax - b.price);
      return bScore - aScore;
    });

    return Response.json({
      success: true,
      recommendations: rankedRecommendations,
      searchArea: postcode,
      totalFound: rankedRecommendations.length
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
