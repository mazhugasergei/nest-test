import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { LeadsModule } from "./leads/leads.module"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [LeadsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
