'use client';

import { useState } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';

export default function BriefsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
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

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📋 Content Briefs
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Create and manage content briefs with detailed guidelines
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Coming Soon
              </h2>
              <p className="text-gray-600 mb-4">
                The Briefs feature is currently in development. This section will allow you to:
              </p>
              <ul className="text-left inline-block text-gray-600 space-y-2">
                <li>✨ Create detailed content briefs</li>
                <li>📝 Define audience personas and guidelines</li>
                <li>🎯 Set content objectives and KPIs</li>
                <li>📊 Track brief performance</li>
              </ul>
            </div>

            <div className="mt-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>💡</span>
                <span>Back to Ideas</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
