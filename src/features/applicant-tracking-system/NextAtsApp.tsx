"use client";

import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Loader from "components/loader";
import { persistor, store } from "redux/store";
import AppShell from "./AppShell";

const Dashboard = lazy(() => import("./dashboard"));
const AtsSettings = lazy(() => import("./settings/ats-settings"));
const JobDetails = lazy(() => import("./job-posting/job-detail-page"));
const JobPosting = lazy(() => import("./job-posting"));
const Candidates = lazy(() => import("./candidates/candidate-tabs.tsx"));
const CandidateDetail = lazy(
  () => import("./candidates/candidate-tabs.tsx/candidate-detail-page")
);
const AddJobPost = lazy(() => import("./job-posting/add-job"));
const AddCandidate = lazy(() => import("./candidates/add-candidate"));
const InterviewDetailPage = lazy(
  () => import("./candidates/candidate-tabs.tsx/interview-detail-page")
);
const JobOfferDetailPage = lazy(
  () => import("./candidates/candidate-tabs.tsx/joboffer-detail-page")
);
const OnboardingDetailPage = lazy(
  () => import("./candidates/candidate-tabs.tsx/onboarding-detail-page")
);
const Marketing = lazy(() => import("./marketing"));
const JobForm = lazy(() => import("./marketing/marketing-form/job-form"));
const OfferLink = lazy(() => import("./OfferLink"));
const FormBuilder = lazy(() =>
  import("./create-job-form").then((module) => ({
    default: module.FormBuilder,
  }))
);

export default function NextAtsApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <BrowserRouter>
          <AppShell>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/ats/dashboard" replace />} />
                <Route path="/admin/ats/dashboard" element={<Dashboard />} />
                <Route path="/admin/ats/settings" element={<AtsSettings />} />
                <Route path="/admin/ats/job-detail-page/:id" element={<JobDetails />} />
                <Route path="/admin/ats/form-builder/:id" element={<FormBuilder />} />
                <Route path="/admin/ats/update-form/:formId" element={<FormBuilder />} />
                <Route path="/admin/ats/job-posting" element={<JobPosting />} />
                <Route path="/admin/ats/candidates" element={<Candidates />} />
                <Route path="/admin/ats/candidate-detail/:id" element={<CandidateDetail />} />
                <Route path="/admin/ats/add-job-post" element={<AddJobPost />} />
                <Route path="/admin/ats/edit-job-post/:id" element={<AddJobPost />} />
                <Route path="/admin/ats/add-candidate" element={<AddCandidate />} />
                <Route path="/admin/ats/interview-detail/:id" element={<InterviewDetailPage />} />
                <Route path="/admin/ats/job-offer-detail/:id/:jobId" element={<JobOfferDetailPage />} />
                <Route path="/admin/ats/onboarding-detail/:id" element={<OnboardingDetailPage />} />
                <Route path="/chs-jobs/:id" element={<Marketing />} />
                <Route path="/apply-job/:jobId/:id" element={<JobForm />} />
                <Route path="/offer-link/:offerid/:candidateid" element={<OfferLink />} />
                <Route path="*" element={<Navigate to="/admin/ats/dashboard" replace />} />
              </Routes>
            </Suspense>
          </AppShell>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
