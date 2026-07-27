import React from 'react';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './store';
import { selectCurrentTab } from './store/selectors';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ContentManager } from './components/ContentManager';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReduxInspector } from './components/ReduxInspector';
import { AsyncSimulator } from './components/AsyncSimulator';
import { SelectorBenchmark } from './components/SelectorBenchmark';
import { PerformanceProfiler } from './components/PerformanceProfiler';
import { LabAssignments } from './components/LabAssignments';
import { VSCodeSetupGuide } from './components/VSCodeSetupGuide';

const MainLayout: React.FC = () => {
  const currentTab = useAppSelector(selectCurrentTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'content' && <ContentManager />}
        {currentTab === 'calendar' && <CalendarView />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'inspector' && <ReduxInspector />}
        {currentTab === 'async' && <AsyncSimulator />}
        {currentTab === 'selectors' && <SelectorBenchmark />}
        {currentTab === 'profiler' && <PerformanceProfiler />}
        {currentTab === 'assignments' && <LabAssignments />}
        {currentTab === 'vscode' && <VSCodeSetupGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400 font-mono">
        Unit 1 • Experiment 2: Redux-Based Content State Management • Redux Toolkit 2.0
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
