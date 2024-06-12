import { Module } from "@nestjs/common"
import { LeadsController } from "./leads.controller"

@Module({
  controllers: [LeadsController],
  providers: [],
})
export class LeadsModule {}
