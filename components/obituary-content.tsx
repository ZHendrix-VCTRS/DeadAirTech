type Props = {
  obituary: string;
};

export function ObituaryContent({ obituary }: Props) {
  const paragraphs = obituary.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-4 font-body text-sm leading-relaxed text-[#d4d4d4]">
      {paragraphs.map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </div>
  );
}
