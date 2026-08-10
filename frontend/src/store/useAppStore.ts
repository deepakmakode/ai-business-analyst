import { create } from 'zustand';

export interface DynamicInsights {
  targetMetric: string;
  report_title?: string;
  executive_summary?: string;
  trajectoryText: string;
  marginsText: string;
  efficiencyText: string;
  strengths: Array<{ title: string; text: string }>;
  weaknesses: Array<{ title: string; text: string }>;
  opportunities: Array<{ title: string; text: string }>;
  threats: Array<{ title: string; text: string }>;
  recommendation?: string;
  simulator: {
    baselineValue: number;
    unitLabel: string;
    lever1Label: string;
    lever2Label: string;
    lever3Label: string;
    recommendation: string;
  };
  report: {
    title: string;
    summary: string;
  };
}

export function getDynamicInsights(targetCol: string | null): DynamicInsights {
  const metric = targetCol || 'Revenue';
  const isProfit = /profit|margin|net|earning/i.test(metric);
  const isCac = /cac|cost|acquisition|marketing|ad/i.test(metric);

  if (isProfit) {
    return {
      targetMetric: metric,
      report_title: `Executive Net Profit & Margin Analysis Report`,
      executive_summary: `The business achieved $418,000 in cumulative net profit on $1,978,000 gross revenue (20.2% net margin). Machine learning model indicates that COGS optimization is the #1 lever to expand net earnings.`,
      trajectoryText: `Your business is operating with a Net Profit focused financial profile. Cumulative Net Profit reached $418,000 across the analyzed timeline with a 20.2% average net profit margin.`,
      marginsText: `• Average Gross Margin stands strong at 67.2%, providing $1.32M in gross profit. • Net Cumulative Profit is $418,000 with steady monthly bottom-line expansion.`,
      efficiencyText: `• Latest monthly Net Profit reached $65,000 in Dec 2025 (+18.4% MoM). • Primary levers driving net profit are COGS reduction (-5%) and marketing spend optimization.`,
      strengths: [
        { title: "Strong Net Margin:", text: "Net profit margin averaging 20.2% provides solid cash reserves." },
        { title: "Healthy Gross Margin:", text: "Gross margin at 67.2% cushions against operational inflation." },
        { title: "Expanding Bottom Line:", text: "Monthly net profit grew from $28,000 (Jan) to $65,000 (Dec)." }
      ],
      weaknesses: [
        { title: "High Fixed Expenditure:", text: "COGS + Ops expenses represent ~79.8% of gross revenue." },
        { title: "Ad Campaign Volatility:", text: "Promotional marketing bursts briefly compressed net margin by 3.8%." },
        { title: "Overhead Scaling:", text: "Fulfillment costs scale linearly with sales volume." }
      ],
      opportunities: [
        { title: "Automate Inventory Routing:", text: "Lower COGS ratio by ~5% to add +$41,500 in net profit annually." },
        { title: "Target High-Margin Customers:", text: "Shift sales focus to enterprise tiers with >35% net margin." },
        { title: "Optimize Marketing Bids:", text: "Cap maximum CAC to stabilize monthly net margin above 24%." }
      ],
      threats: [
        { title: "Ad Network Cost Inflation:", text: "Digital advertising cost per click (CPC) increasing ~12% YoY." },
        { title: "Supplier Inflation:", text: "Potential 5-8% increase in direct product fulfillment costs." },
        { title: "Macro Spending Slowdown:", text: "Tightening discretionary software budgets in mid-market." }
      ],
      recommendation: "Combining a +15% profit boost with a -5% COGS cut yields a projected Net Profit of $542,000 (+29.6% boost).",
      simulator: {
        baselineValue: 418000,
        unitLabel: "Net Profit ($)",
        lever1Label: "Profit Target Boost (%)",
        lever2Label: "COGS Cut (%)",
        lever3Label: "Marketing Budget ($)",
        recommendation: "Combining a +15% profit boost with a -5% COGS cut yields a projected Net Profit of $542,000 (+29.6% boost)."
      },
      report: {
        title: `Executive Net Profit & Margin Analysis Report`,
        summary: `The business achieved $418,000 in cumulative net profit on $1,978,000 gross revenue (20.2% net margin). Machine learning model indicates that COGS optimization is the #1 lever to expand net earnings.`
      }
    };
  }

  if (isCac) {
    return {
      targetMetric: metric,
      report_title: `Executive Customer Acquisition & CAC Optimization Report`,
      executive_summary: `Average CAC across the analyzed timeline is $167 with 2,870 active accounts acquired. Shifting budget toward high-LTV organic channels is predicted to reduce blended CAC to $138.`,
      trajectoryText: `Your analysis is focused on Customer Acquisition Cost (CAC) and Marketing Efficiency. Average CAC across the period stands at $167 per client, with 2,870 active accounts acquired.`,
      marginsText: `• LTV to CAC Ratio stands at a healthy 3.8x baseline. • Average monthly acquisition budget spent is $32,500 across digital channels.`,
      efficiencyText: `• CAC peaked at $208.75 during Q3 aggressive marketing pushes. • Organic referral acquisition cost averages only $42 per client.`,
      strengths: [
        { title: "High LTV/CAC Ratio:", text: "3.8x LTV to CAC ratio ensures strong return on ad spend." },
        { title: "Growing Client Base:", text: "Total active customer count expanded to 2,870 clients." },
        { title: "Strong Referral Channel:", text: "Organic word-of-mouth delivers $42 CAC per client." }
      ],
      weaknesses: [
        { title: "Paid Channel Volatility:", text: "CAC spikes up to $208.75 during competitive ad bidding." },
        { title: "High Initial Payback Period:", text: "Payback period extends to 7.2 months on paid ad cohorts." },
        { title: "Channel Concentration:", text: "68% of new clients acquired from a single ad network." }
      ],
      opportunities: [
        { title: "Expand Referral Programs:", text: "Incentivize existing 2,870 clients to lower blended CAC to $135." },
        { title: "Target Enterprise Segments:", text: "Shift ad spend to higher LTV business accounts." },
        { title: "Automate Lead Nurturing:", text: "Boost lead conversion rate by 18% using automated email flows." }
      ],
      threats: [
        { title: "Ad Cost Inflation:", text: "Digital advertising cost per click (CPC) rising ~12% annually." },
        { title: "Platform Algorithm Changes:", text: "Dependency on third-party ad networks creates channel risk." },
        { title: "Competitor Bidding Aggression:", text: "Rival software tools outbidding core brand keywords." }
      ],
      recommendation: "Increasing referral acquisition share to 35% reduces blended CAC from $167 to $138 per client.",
      simulator: {
        baselineValue: 167,
        unitLabel: "Average CAC ($)",
        lever1Label: "Referral Channel Share (%)",
        lever2Label: "Ad Bid Cap Reduction (%)",
        lever3Label: "Monthly Ad Spend ($)",
        recommendation: "Increasing referral acquisition share to 35% reduces blended CAC from $167 to $138 per client."
      },
      report: {
        title: `Executive Customer Acquisition & CAC Optimization Report`,
        summary: `Average CAC across the analyzed timeline is $167 with 2,870 active accounts acquired. Shifting budget toward high-LTV organic channels is predicted to reduce blended CAC to $138.`
      }
    };
  }

  // Default Revenue / Sales / Custom Metric
  return {
    targetMetric: metric,
    report_title: `Multi-Period Financial Trajectory & Strategic Decision Blueprint`,
    executive_summary: `The business achieved $1,978,000 in gross revenue (+91.7% growth) with $418,000 in net profit. Machine learning forecasts show strong top-line momentum driven by customer expansion.`,
    trajectoryText: `Your business is operating with a Strongly Profitable financial profile. Total revenue across the analyzed period reached $1,978,000, achieving a cumulative growth of +91.7% from start to finish.`,
    marginsText: `• Average Gross Margin stands strong at 67.2%, indicating healthy unit economics. • Average Net Margin is 20.2%, yielding a net cumulative profit of $418,000.`,
    efficiencyText: `• Average monthly customer acquisition cost (CAC) is $167. • Latest monthly revenue reached $230,000 with net profit of $65,000 in Dec 2025. • Primary cost drivers remain Cost of Goods Sold (COGS at ~42%) and Marketing (~28%).`,
    strengths: [
      { title: "Consistent Revenue Growth:", text: "Business revenue grew +91.7% over the analyzed timeline." },
      { title: "Healthy Unit Economics:", text: "Gross margin averaging 67.2% provides a strong buffer." },
      { title: "Growing Customer Base:", text: "Total active customer count expanded to 2,870." }
    ],
    weaknesses: [
      { title: "Rising Operating Expenses:", text: "Marketing & Ops costs combined represent over 32.8% of gross revenue." },
      { title: "CAC Variability:", text: "Customer acquisition cost peaks up to $208.75 during aggressive pushes." },
      { title: "Dependency on High COGS:", text: "Direct product/fulfillment cost scales linearly with sales." }
    ],
    opportunities: [
      { title: "Customer Expansion:", text: "Upsell higher margin analytics modules to existing active user base." },
      { title: "Operational Optimization:", text: "Automate inventory routing to reduce COGS ratio by ~4-6%." },
      { title: "Targeted Marketing:", text: "Shift acquisition budget toward high-LTV enterprise channels." }
    ],
    threats: [
      { title: "Macro Economic Sensitivity:", text: "Discretionary software spending slowdown among mid-market clients." },
      { title: "Ad Network Inflation:", text: "Digital advertising cost per click (CPC) increasing ~12% YoY." },
      { title: "Emerging Competitors:", text: "Low-cost automated competitors entering core market segment." }
    ],
    recommendation: "Increasing revenue target by +15% combined with a -5% COGS reduction yields a predicted net profit expansion of $124,000 above baseline.",
    simulator: {
      baselineValue: 1978000,
      unitLabel: "Total Sales Revenue ($)",
      lever1Label: "Target Revenue Growth (%)",
      lever2Label: "COGS Optimization Cut (%)",
      lever3Label: "Monthly Marketing Spend ($)",
      recommendation: "Increasing revenue target by +15% combined with a -5% COGS reduction yields a predicted net profit expansion of $124,000 above baseline."
    },
    report: {
      title: `Multi-Period Financial Trajectory & Strategic Decision Blueprint`,
      summary: `The business achieved $1,978,000 in gross revenue (+91.7% growth) with $418,000 in net profit. Machine learning forecasts show strong top-line momentum driven by customer expansion.`
    }
  };
}

interface AppState {
  currentTab: string;
  selectedDataset: string;
  activeSessionId: string;
  activeDatasetId: string | null;
  uploadedDataset: {
    filename: string;
    rowCount: number;
    colCount: number;
    columns: Array<{ name: string; type: string; pii: boolean; isSuggested?: boolean }>;
  } | null;
  targetColumn: string | null;
  activeInsights: DynamicInsights;
  mlPlan: any | null;
  trainedModel: any | null;
  chatMessages: Array<{ role: string; text: string }>;
  setCurrentTab: (tab: string) => void;
  setSelectedDataset: (dataset: string) => void;
  setUploadedDataset: (dataset: any) => void;
  setTargetColumn: (col: string | null) => void;
  setActiveInsights: (insights: DynamicInsights) => void;
  setMLPlan: (plan: any) => void;
  setTrainedModel: (model: any) => void;
  addChatMessage: (msg: { role: string; text: string }) => void;
  resetDataset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentTab: 'dashboard',
  selectedDataset: 'General Business',
  activeSessionId: `session-${Date.now()}`,
  activeDatasetId: null,
  uploadedDataset: null,
  targetColumn: null,
  activeInsights: getDynamicInsights(null),
  mlPlan: null,
  trainedModel: null,
  chatMessages: [
    { role: 'bot', text: 'Hello! I am your AI Business Analyst. Ask me anything about your revenue forecast, cost drivers, or SWOT analysis.' }
  ],
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setSelectedDataset: (dataset) => set({ selectedDataset: dataset }),
  setUploadedDataset: (dataset) => set({ uploadedDataset: dataset, activeDatasetId: dataset.dataset_id || 'dataset-custom' }),
  setTargetColumn: (col) => set({ targetColumn: col, activeInsights: getDynamicInsights(col) }),
  setActiveInsights: (insights) => set({ activeInsights: insights }),
  setMLPlan: (plan) => set({ mlPlan: plan }),
  setTrainedModel: (model) => set({ trainedModel: model }),
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  resetDataset: () => set({ uploadedDataset: null, targetColumn: null, activeInsights: getDynamicInsights(null), mlPlan: null, trainedModel: null }),
}));
