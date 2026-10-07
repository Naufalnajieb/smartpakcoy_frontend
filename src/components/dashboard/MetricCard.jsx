import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import "./MetricCard.css";

function MetricCard({ title, value, unit, icon: Icon, trend, trendLabel, iconClass = "" }) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;

  return (
    <article className="metric-card">
      <div className={`metric-icon ${iconClass}`}>
        <Icon size={24} strokeWidth={2.2} />
      </div>

      <div className="metric-content">
        <span className="metric-title">{title}</span>
        <div className="metric-value">
          {value}
          <small>{unit}</small>
        </div>

        {trendLabel && (
          <div className={`metric-trend ${trend || "neutral"}`}>
            <TrendIcon size={14} />
            <span>{trendLabel}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default MetricCard;