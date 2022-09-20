import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateOrderDto} from "../dto/orders/CreateOrderDto";
import {CreateOrderResponseDto} from "../dto/orders/CreateOrderResponse";
import {TrackOrderDto} from "../dto/track/TrackOrder";
import {TrackOrderResponseDto} from "../dto/track/TrackOrderResponse";

@CommandHandler(TrackOrderDto)
export class OrderTrackCommandHandler implements ICommandHandler<TrackOrderDto>{


  public async execute(command: TrackOrderDto): Promise<TrackOrderResponseDto> {

  }
}
