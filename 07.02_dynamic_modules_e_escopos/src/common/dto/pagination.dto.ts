import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;
}
