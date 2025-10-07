import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Target, TrendingUp, Brain, BarChart3, FileText, Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Evaluation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Score & Compare Your
              <span className="text-primary block">Startup Ideas</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              A fast, AI-assisted way to evaluate startup ideas with comprehensive scoring across market, moat, and monetization dimensions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/ideas/new">
                  Start Evaluating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href="/ideas">Browse Ideas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use Our Evaluator?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make informed decisions with data-driven insights and AI-powered market analysis.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Get market intelligence from Gemini, OpenAI, or local LLMs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Leverage cutting-edge AI to analyze market segments, identify competitors, and suggest optimal pricing models for your startup idea.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Comprehensive Scoring</CardTitle>
                <CardDescription>Evaluate across 12 key metrics with weighted composites</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Score your ideas across market potential, competitive moats, and monetization strength with customizable weights and visual charts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Export & Compare</CardTitle>
                <CardDescription>Generate reports and compare multiple evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export your best evaluations to CSV, generate recommendation reports, and compare ideas side-by-side to make the best choice.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scoring Model Section */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Scoring Framework</h2>
              <p className="text-lg text-muted-foreground">
                Evaluate startup ideas across three critical dimensions with proven methodologies.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Market</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  TAM, Growth Potential, Problem Pain, Competition
                </p>
                <div className="text-xs text-muted-foreground font-mono bg-background rounded px-3 py-2">
                  avg(tam, growth, pain, 10-competition)
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Moat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Differentiation, Switching Costs, Defensibility, Network Effects
                </p>
                <div className="text-xs text-muted-foreground font-mono bg-background rounded px-3 py-2">
                  avg(differentiation, switching, defensibility, network)
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Monetization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  LTV/CAC, Pricing Clarity, Gross Margin, Sales Cycle
                </p>
                <div className="text-xs text-muted-foreground font-mono bg-background rounded px-3 py-2">
                  avg(ltvCac, pricing, margin, 10-salesCycle)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Built with Modern Tech</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Full-stack application powered by Next.js, Express, MongoDB, and multiple AI providers.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Next.js', 'TypeScript', 'MongoDB', 'Express', 'Gemini AI', 'shadcn/ui', 'Chart.js', 'SWR'].map((tech) => (
                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/ideas/new">
                  Get Started Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/srujan7m/idea_evaluator" target="_blank">
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
