'use client';

import { sendGAEvent } from '@next/third-parties/google';

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !eventName) {
    return;
  }

  sendGAEvent('event', eventName, cleanParams(params));
};

export const trackNavigationClick = ({ location, label, destination }) =>
  trackEvent('navigation_click', {
    location,
    label,
    destination,
  });

export const trackAiToolEvent = ({
  toolName,
  action,
  status,
  mode,
  surface,
  hasPdf,
}) =>
  trackEvent('ai_tool_action', {
    tool_name: toolName,
    action,
    status,
    mode,
    surface,
    has_pdf: hasPdf,
  });

export const trackAdminAction = ({ action, target, status, method }) =>
  trackEvent('admin_action', {
    action,
    target,
    status,
    method,
  });

export const trackContentClick = ({ contentType, slug, location }) =>
  trackEvent('content_click', {
    content_type: contentType,
    slug,
    location,
  });
