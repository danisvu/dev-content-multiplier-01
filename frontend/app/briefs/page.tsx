'use client';

import { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PageTransition } from '../components/PageTransition';

export default function BriefsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Briefs' }
            ]}
            className="text-gray-600"
          />
        </div>

        <div className="bg-card rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              📋 Content Briefs
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Create and manage content briefs with detailed guidelines
            </p>

            <div className="bg-muted/50 border rounded-lg p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-semibold mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground mb-4">
                The Briefs feature is currently in development. This section will allow you to:
              </p>
              <ul className="text-left inline-block text-muted-foreground space-y-2">
                <li>✨ Create detailed content briefs</li>
                <li>📝 Define audience personas and guidelines</li>
                <li>🎯 Set content objectives and KPIs</li>
                <li>📊 Track brief performance</li>
              </ul>
            </div>

            <div className="mt-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span>💡</span>
                <span>Back to Ideas</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
