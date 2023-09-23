import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes } from "@graphprotocol/graph-ts"
import { ReportedAddress } from "../generated/schema"
import { ReportedAddress as ReportedAddressEvent } from "../generated/Sqam/Sqam"
import { handleReportedAddress } from "../src/sqam"
import { createReportedAddressEvent } from "./sqam-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let reported = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let reporter = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newReportedAddressEvent = createReportedAddressEvent(reported, reporter)
    handleReportedAddress(newReportedAddressEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ReportedAddress created and stored", () => {
    assert.entityCount("ReportedAddress", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ReportedAddress",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "reported",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ReportedAddress",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "reporter",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
