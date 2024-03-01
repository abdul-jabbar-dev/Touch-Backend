interface ISendResponse<D, M> {
  message?: string;
  data?: D;
  meta?: M;
  status: boolean;
}
export default ISendResponse