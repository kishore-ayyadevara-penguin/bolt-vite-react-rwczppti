import React from 'react';
import { TrendingUp, Target, DollarSign } from 'lucide-react';
import { RAFScores } from '../types';
import { calculateRevenue, formatCurrency } from '../utils/revenueCalculations';

interface RAFOverviewProps {
  scores: RAFScores;
}

export function RAFOverview({ scores }: RAFOverviewProps) {
  const currentRevenue = calculateRevenue(scores.totalCurrent);
  const potentialRevenue = calculateRevenue(scores.totalCurrent + scores.totalPotential);
  const revenueGap = potentialRevenue - currentRevenue;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">RAF Score & Revenue Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Average RAF</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{scores.current.toFixed(3)}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Potential RAF</span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {(scores.current + scores.potential).toFixed(3)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-600">Current Revenue</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(currentRevenue)}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <span className="text-gray-600">Expected Revenue</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(potentialRevenue)}</p>
              <p className="text-sm text-gray-500 mt-1">
                Potential increase: <span className="text-green-600 font-medium">+{formatCurrency(revenueGap)}</span>
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Progress to Target</span>
              <span className="text-xl font-bold text-purple-600">
                {scores.percentageToTarget}%
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-100">
              <div
                style={{ width: `${scores.percentageToTarget}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Required Actions for Additional Revenue</h3>
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">AI-Identified HCCs</span>
                <span className="text-gray-500">Coding Review</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Review and validate AI-identified HCC opportunities
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-red-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 font-medium">Dropped HCCs</span>
                <span className="text-gray-500">Care Manager Review</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Address conditions present last year but not documented this year
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-600 font-medium">Missing POC</span>
                <span className="text-gray-500">Documentation Required</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Complete plan of care documentation for identified conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}