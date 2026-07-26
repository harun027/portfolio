"use client";

import { Card } from "@heroui/react";

export function ServiceCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border border-line">
      <Card.Header>
        <Card.Title className="display text-xl md:text-2xl">{title}</Card.Title>
        <Card.Description className="text-sm leading-relaxed text-muted">
          {body}
        </Card.Description>
      </Card.Header>
    </Card>
  );
}
