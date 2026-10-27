import { isValidPostcodeFormat } from '../../utils/postcode';
import { searchProviders, AllProvidersFailedError } from '../../providers';
import { validateRecommendationRequest } from '../../utils/requestValidation';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    // Validate and normalise input before any lookup or provider call.
    // Only the normalised values are used from here on; extra keys are dropped.
    const validation = validateRecommendationRequest(body);
    if (!validation.ok) {
      return Response.json({ message: validation.message }, { status: 400 });
    }
    const { postcode, budgetMin, budgetMax, mealOptions } = validation.value;

    // External APIs are disconnected for now: the postcode is format-checked
    // offline and not looked up on postcodes.io, so there are no coordinates
    // and results come back without a distance. To reconnect, call
    // lookupPostcode from ../../utils/postcode here.
    if (!isValidPostcodeFormat(postcode)) {
      return Response.json(
        { message: 'Please enter a valid UK postcode (for example SW1A 1AA).' },
        { status: 400 }
      );
    }

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, this would:
    // 1. Get coordinates from postcode (postcodes.io, disconnected for now)
    // 2. Query food delivery APIs (Deliveroo, Just Eat, Uber Eats) via the
    //    provider registry in src/app/providers (currently mock data only)
    // 3. Use LLM to process and rank results
    // 4. Filter by budget and meal preferences

    let results;
    try {
      results = await searchProviders({
        postcode,
        latitude: null,
        longitude: null,
        budgetMin,
        budgetMax,
        mealOptions,
      });
    } catch (error) {
      if (error instanceof AllProvidersFailedError) {
        return Response.json(
          { message: 'Restaurant search is unavailable right now. Please try again later.' },
          { status: 502 }
        );
      }
      throw error;
    }

    const recommendations = results.filter(item => {
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
