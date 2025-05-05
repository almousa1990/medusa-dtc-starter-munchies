import config from "@/config";

export const normalizeMockupRenditions = (renditions: any[]) => {
  return renditions.map((r) => ({
    id: r.id,
    template_id: r.template_id,
    url: r.cache_key ? `${config.baseUrl}/api/mockup/${r.cache_key}` : null,
    status: r.status,
    rank: r.template.rank,
    display_name: r.template.display_name,
  }));
};
