import {
  ReportedAddress as ReportedAddressEvent,
  ReportedDomain as ReportedDomainEvent
} from "../generated/Sqam/Sqam"
import { ReportedAddress, ReportedDomain } from "../generated/schema"

export function handleReportedAddress(event: ReportedAddressEvent): void {
  let entity = new ReportedAddress(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.reported = event.params.reported
  entity.reporter = event.params.reporter

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReportedDomain(event: ReportedDomainEvent): void {
  let entity = new ReportedDomain(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.domainHash = event.params.domainHash
  entity.good = event.params.good
  entity.reporter = event.params.reporter
  entity.domain = event.params.domain

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
