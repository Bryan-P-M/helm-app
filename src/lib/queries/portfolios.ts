import { createClient } from "@/lib/supabase/server";
import { Portfolio, PortfolioWithRelations } from "@/lib/types/portfolio";

export async function getPortfolios(workspaceId: string): Promise<PortfolioWithRelations[]> {
  const supabase = await createClient();

  const { data: portfolios, error: portfoliosError } = await supabase
    .from("portfolios")
    .select("*, director:director_id(id, full_name)")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  if (portfoliosError) {
    console.error("Error fetching portfolios:", portfoliosError);
    return [];
  }

  const { data: programmesCountData, error: programmesCountError } = await supabase
    .from("programmes")
    .select("portfolio_id")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null);

  if (programmesCountError) {
    console.error("Error fetching programmes count:", programmesCountError);
    return portfolios as PortfolioWithRelations[];
  }

  const programmeCounts: { [key: string]: number } = {};
  programmesCountData.forEach((programme) => {
    if (programme.portfolio_id) {
      programmeCounts[programme.portfolio_id] = (programmeCounts[programme.portfolio_id] || 0) + 1;
    }
  });

  return portfolios.map((portfolio) => ({
    ...portfolio,
    programme_count: programmeCounts[portfolio.id] || 0,
  })) as PortfolioWithRelations[];
}

export async function getPortfolioDetail(portfolioId: string) {
  const supabase = await createClient();

  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .select("*, director:director_id(id, full_name)")
    .eq("id", portfolioId)
    .is("deleted_at", null)
    .single();

  if (portfolioError) {
    console.error("Error fetching portfolio detail:", portfolioError);
    return null;
  }

  const { data: programmes, error: programmesError } = await supabase
    .from("programmes")
    .select("id, name, code, status, rag_status, programme_manager_id, programme_manager:programme_manager_id(id, full_name)")
    .eq("portfolio_id", portfolioId)
    .is("deleted_at", null);

  if (programmesError) {
    console.error("Error fetching programmes for portfolio:", programmesError);
    return { ...portfolio, programmes: [] };
  }

  // Aggregate project counts for each programme (example - actual implementation might involve another query)
  const programmesWithProjectCounts = await Promise.all(
    programmes.map(async (programme) => {
      const { count, error } = await supabase
        .from("projects")
        .select("id", { count: "exact" })
        .eq("programme_id", programme.id)
        .is("deleted_at", null);

      if (error) {
        console.error("Error fetching project count for programme:", error);
        return { ...programme, project_count: 0 };
      }
      return { ...programme, project_count: count || 0 };
    })
  );


  // Aggregated RAID items (example - actual implementation might involve specific RAID tables)
  // For now, we'll just simulate some counts
  const totalProgrammes = programmes.length;
  const totalProjects = programmesWithProjectCounts.reduce((acc, curr) => acc + curr.project_count, 0);
  const redAmberRaidItems = Math.floor(Math.random() * 5); // Simulated

  return {
    ...portfolio,
    programmes: programmesWithProjectCounts,
    totalProgrammes,
    totalProjects,
    redAmberRaidItems,
  };
}
