import { ClientAppointment } from "src/shared/entities/ClientAppointment";
import { AppointmentViewModel } from "./appointment.view-model";
import { ClientViewModel } from "./client.view-model";

export class ClientAppointmentViewModel {
  appointmentId: string;
  appointment: any;
  client: ClientViewModel;
  constructor(model: ClientAppointment | undefined){
    if (!model || model === null) {
      return null;
    }
    this.appointmentId = model.appointmentId;
    this.appointment = model.appointment;
    this.client = new ClientViewModel(model.client);
  }
}
