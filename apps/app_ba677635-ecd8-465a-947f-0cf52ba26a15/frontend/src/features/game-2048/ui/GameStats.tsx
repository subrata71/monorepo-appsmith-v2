import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface GameStatsProps {
  score: number;
  bestScore: number;
}

export function GameStats({ score, bestScore }: GameStatsProps) {
  return (
    <div className="flex gap-4 justify-center">
      <Card className="p-4 text-center">
        <h3 className="text-sm font-medium text-muted-foreground">Score</h3>
        <Badge variant="secondary" className="text-xl font-bold mt-1">
          {score.toLocaleString()}
        </Badge>
      </Card>
      
      <Card className="p-4 text-center">
        <h3 className="text-sm font-medium text-muted-foreground">Best</h3>
        <Badge variant="outline" className="text-xl font-bold mt-1">
          {bestScore.toLocaleString()}
        </Badge>
      </Card>
    </div>
  );
}