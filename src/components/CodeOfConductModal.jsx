// src/components/CodeOfConductModal.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export function CodeOfConductModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0F2240] border border-[#1F3C6B] text-[#F7F4EE] max-h-[85vh] overflow-y-auto rounded-[10px] p-6 sm:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold font-heading text-[#F7F4EE]">
            Skill Share Code of Conduct &amp; Safety Guidelines
          </DialogTitle>
          <DialogDescription className="text-[#9DB8D6] text-xs">
            NED University of Engineering &amp; Technology • Civics &amp; Community Engagement Platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs sm:text-sm text-[#F7F4EE]/90 leading-relaxed">
          <div className="p-3.5 rounded-[6px] bg-[#0A1628] border border-[#1F3C6B] space-y-1">
            <h4 className="font-semibold text-[#E0A030] text-sm">
              1. 100% Free and Volunteer-Based
            </h4>
            <p className="text-[#9DB8D6] text-xs">
              All sessions are purely volunteer-led. Demanding money, charging for notes, or selling external tutoring services is strictly prohibited and results in immediate account suspension.
            </p>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#0A1628] border border-[#1F3C6B] space-y-1">
            <h4 className="font-semibold text-[#E0A030] text-sm">
              2. Respect Privacy and Keep Communication On-Platform
            </h4>
            <p className="text-[#9DB8D6] text-xs">
              Personal contact details remain hidden until a session is confirmed. Never coerce peers to switch to third-party messaging apps for non-academic discussions.
            </p>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#0A1628] border border-[#1F3C6B] space-y-1">
            <h4 className="font-semibold text-[#E0A030] text-sm">
              3. Online Minimum 1-Hour Focus
            </h4>
            <p className="text-[#9DB8D6] text-xs">
              Every scheduled session must last at least 60 minutes, focusing on conceptual clarity, mutual respect, and patient pedagogy.
            </p>
          </div>

          <div className="p-3.5 rounded-[6px] bg-[#0A1628] border border-[#1F3C6B] space-y-1">
            <h4 className="font-semibold text-[#E0A030] text-sm">
              4. Zero Tolerance for Misbehavior
            </h4>
            <p className="text-[#9DB8D6] text-xs">
              Any abusive language, harassment, or no-shows can be flagged with the one-click Report Button. Administrators review reported transcripts and enforce campus disciplinary action.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 rounded-[6px] bg-[#E0A030] text-[#0A1628] text-xs font-semibold hover:bg-[#A86F10] hover:text-[#F7F4EE] transition-colors cursor-pointer"
          >
            I Understand and Agree
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
