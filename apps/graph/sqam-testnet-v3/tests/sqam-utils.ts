import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes } from "@graphprotocol/graph-ts"
import { ReportedAddress, ReportedDomain } from "../generated/Sqam/Sqam"

export function createReportedAddressEvent(
  reported: Address,
  reporter: Address
): ReportedAddress {
  let reportedAddressEvent = changetype<ReportedAddress>(newMockEvent())

  reportedAddressEvent.parameters = new Array()

  reportedAddressEvent.parameters.push(
    new ethereum.EventParam("reported", ethereum.Value.fromAddress(reported))
  )
  reportedAddressEvent.parameters.push(
    new ethereum.EventParam("reporter", ethereum.Value.fromAddress(reporter))
  )

  return reportedAddressEvent
}

export function createReportedDomainEvent(
  domainHash: Bytes,
  good: boolean,
  reporter: Address,
  domain: string
): ReportedDomain {
  let reportedDomainEvent = changetype<ReportedDomain>(newMockEvent())

  reportedDomainEvent.parameters = new Array()

  reportedDomainEvent.parameters.push(
    new ethereum.EventParam(
      "domainHash",
      ethereum.Value.fromFixedBytes(domainHash)
    )
  )
  reportedDomainEvent.parameters.push(
    new ethereum.EventParam("good", ethereum.Value.fromBoolean(good))
  )
  reportedDomainEvent.parameters.push(
    new ethereum.EventParam("reporter", ethereum.Value.fromAddress(reporter))
  )
  reportedDomainEvent.parameters.push(
    new ethereum.EventParam("domain", ethereum.Value.fromString(domain))
  )

  return reportedDomainEvent
}
