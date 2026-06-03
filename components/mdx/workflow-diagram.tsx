import * as React from "react";
import { ArrowDownIcon, CornerDownRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowStepProps {
  node: string;
  detail?: string;
  /** Label on the connector into this step, e.g. "webhook / trigger". */
  via?: string;
}

export interface WorkflowOutputProps {
  children: React.ReactNode;
}

export interface WorkflowDiagramProps {
  children: React.ReactNode;
  caption?: string;
  className?: string;
}

/**
 * Marker children for WorkflowDiagram. Not rendered on their own.
 */
export function WorkflowStep(_props: WorkflowStepProps) {
  return null;
}

export function WorkflowOutput(_props: WorkflowOutputProps) {
  return null;
}

/**
 * Vertical workflow diagram for MDX posts. Use child elements (MDX-friendly),
 * not array props:
 *
 * <WorkflowDiagram caption="Optional caption">
 *   <WorkflowStep node="n8n" via="webhook" detail="Normalize payload." />
 *   <WorkflowOutput>Email API</WorkflowOutput>
 * </WorkflowDiagram>
 */
export function WorkflowDiagram({
  children,
  caption,
  className,
}: WorkflowDiagramProps) {
  const steps: WorkflowStepProps[] = [];
  const outputs: string[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as WorkflowStepProps & WorkflowOutputProps;
    // Prop-based detection: MDX may pass a different component reference than
    // our local WorkflowStep export, so avoid child.type === WorkflowStep.
    if (typeof props.node === "string") {
      steps.push({
        node: props.node,
        detail: props.detail,
        via: props.via,
      });
      return;
    }
    if (props.children != null) {
      const text = props.children;
      if (typeof text === "string" || typeof text === "number") {
        outputs.push(String(text));
      }
    }
  });

  if (steps.length === 0) return null;

  return (
    <figure
      className={cn(
        "not-prose my-8 rounded-2xl border border-border bg-surface-soft p-5 sm:p-7",
        className,
      )}
    >
      <div className="mx-auto flex max-w-xl flex-col items-stretch">
        {steps.map((step, i) => (
          <React.Fragment key={`${step.node}-${i}`}>
            {i > 0 ? <Connector label={step.via} /> : null}
            <StepCard step={step} index={i} />
          </React.Fragment>
        ))}

        {outputs.length > 0 ? (
          <div className="mt-1">
            <div className="flex justify-center py-2">
              <ArrowDownIcon
                className="h-4 w-4 text-ink-faint"
                aria-hidden
              />
            </div>
            <ul className="space-y-2">
              {outputs.map((out, i) => (
                <li
                  key={`${out}-${i}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5"
                >
                  <CornerDownRightIcon
                    className="h-4 w-4 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span className="text-sm leading-snug text-ink">{out}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {caption ? (
        <figcaption className="mt-5 text-center font-mono text-xs text-ink-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1.5">
      <span className="h-3 w-px bg-border-strong" aria-hidden />
      {label ? (
        <span className="my-1 rounded-full bg-surface px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-ink-faint">
          {label}
        </span>
      ) : null}
      <ArrowDownIcon className="h-4 w-4 text-ink-faint" aria-hidden />
    </div>
  );
}

function StepCard({ step, index }: { step: WorkflowStepProps; index: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2.5 sm:w-40 sm:shrink-0">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-soft font-mono text-[0.6875rem] font-semibold text-accent">
          {index + 1}
        </span>
        <span className="font-mono text-sm font-semibold text-ink">
          {step.node}
        </span>
      </div>
      {step.detail ? (
        <p className="text-sm leading-snug text-ink-muted sm:border-l sm:border-border sm:pl-4">
          {step.detail}
        </p>
      ) : null}
    </div>
  );
}
