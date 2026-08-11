"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const PREFS_KEY = "flowforge-ai-preferences";

const DEFAULT_PREFS = {
  enableAiAssistant: true,
  aiSuggestions: true,
  aiTaskCreation: true,
  aiProjectSummaries: true,
  aiProductivityAnalysis: false
};

export function AISettings() {
  const [mounted, setMounted] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(PREFS_KEY);
    if (stored) {
      try {
        setPrefs(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse AI prefs");
      }
    }
  }, []);

  const updatePref = (key: keyof typeof DEFAULT_PREFS, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    localStorage.setItem(PREFS_KEY, JSON.stringify(newPrefs));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <CardTitle>AI Settings</CardTitle>
          </div>
          <CardDescription>
            Manage AI features and preferences. AI features use a server-side API key. No API keys are exposed to your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable AI Assistant</Label>
              <p className="text-sm text-muted-foreground">Allow the AI assistant to be used in this application</p>
            </div>
            <Switch 
              checked={prefs.enableAiAssistant}
              onCheckedChange={(c) => updatePref("enableAiAssistant", c)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Suggestions</Label>
              <p className="text-sm text-muted-foreground">Get intelligent suggestions for task prioritization</p>
            </div>
            <Switch 
              checked={prefs.aiSuggestions}
              onCheckedChange={(c) => updatePref("aiSuggestions", c)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Task Creation</Label>
              <p className="text-sm text-muted-foreground">Allow creating tasks through natural language commands</p>
            </div>
            <Switch 
              checked={prefs.aiTaskCreation}
              onCheckedChange={(c) => updatePref("aiTaskCreation", c)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Project Summaries</Label>
              <p className="text-sm text-muted-foreground">Generate automatic project status summaries</p>
            </div>
            <Switch 
              checked={prefs.aiProjectSummaries}
              onCheckedChange={(c) => updatePref("aiProjectSummaries", c)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Productivity Analysis</Label>
              <p className="text-sm text-muted-foreground">Get personalized productivity insights and tips</p>
            </div>
            <Switch 
              checked={prefs.aiProductivityAnalysis}
              onCheckedChange={(c) => updatePref("aiProductivityAnalysis", c)}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
