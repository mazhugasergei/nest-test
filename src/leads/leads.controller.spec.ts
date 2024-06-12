import { Test, TestingModule } from "@nestjs/testing"
import { LeadsController } from "./leads.controller"

describe("LeadsController", () => {
  let controller: LeadsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
    }).compile()

    controller = module.get<LeadsController>(LeadsController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
  it("should return a non-empty array of leads", async () => {
    const result = await controller.find({ query: "123" })
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBeGreaterThan(0)
  })

  it("should return empty arrays of leads and contacts", async () => {
    const result = await controller.find({
      query: "testttttttttttttttttttt",
    })
    expect(result).toEqual([])
  })
})
